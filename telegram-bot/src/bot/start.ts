import { Composer, InlineKeyboard } from 'grammy'
import type { Context } from './context.js'
import { privateKeyToAccount } from 'thirdweb/wallets'
import { createThirdwebClient } from 'thirdweb'
import { config } from 'dotenv' 
import { set } from 'valibot'
config()

const composer = new Composer<Context>()

const feature = composer.chatType('private')

const adminAccount = privateKeyToAccount({
  privateKey: process.env.ADMIN_SECRET_KEY as string,
  client: createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID as string }),
})

feature.command('start', async (ctx) => {

  console.log('start command')

  ///ctx.getAuthor 

  const center = ctx.me.username;


  const username = ctx.from?.id+"";

  console.log('username', username)


  const expiration = Date.now() + 6000_000; // valid for 100 minutes
  const message = JSON.stringify({
    username,
    expiration,
  });

  const authCode = await adminAccount.signMessage({
    message,
  });

  const url = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}`

  //console.log('url', url)



  let totalAccountCount = "";
  let totalTradingAccountBalance = "";


  const response = await fetch("https://owinwallet.com/api/agent/getApplicationsForCenter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: '0x',
      center,
    }),
  });
  if (response.status !== 200) {
    return ctx.reply("Failed to get leaderboard");
  } else {

    const data = await response.json();

    //console.log("data", data);

    totalAccountCount = data.result.totalCount;
      
    totalTradingAccountBalance = data.result.totalTradingAccountBalance

    ///const applications = data.result.applications;



    
  }





  const keyboard = new InlineKeyboard()
    .webApp('마이 페이지', url)
    .row()
    .text("총 계정 수: " + totalAccountCount)
    .row()
    .text("총 거래 잔고: " + "$" + Number(totalTradingAccountBalance).toFixed(2))
  
  return ctx.reply(
    'OKX AI 센터 봇을 시작합니다.',
    { reply_markup: keyboard}
  )

})




export { composer as startFeature }
