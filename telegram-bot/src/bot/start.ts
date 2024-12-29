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

  const center = ctx.me.username;

  console.log('center', center)


  const userid = ctx.from?.id+"";

  console.log('userid', userid)

 
  const expiration = Date.now() + 6000_000; // valid for 100 minutes
  const message = JSON.stringify({
    username: userid,
    expiration,
  });

  const authCode = await adminAccount.signMessage({
    message,
  });

  const url = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}`

  //console.log('url', url)


  const keyboard = new InlineKeyboard()
    .webApp('마이 페이지 앱 시작하기', url)
    .row()
    .text("총 거래 계정", "totalTradingAccountBalance")
    .row()
    .text("설명", "about");



  
  return ctx.reply(
    'OKX AI 에이전트 봇',
    { reply_markup: keyboard}
  )

})




/*
bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    if (data === "leaderboard") {
        ctx.reply("Leaderboard!!! \n1. User1\n2. User2\n3. User3");
    } else if (data === "about") {
        ctx.reply("About!!! \nThis is a game bot");
    }
});
*/

feature.on('callback_query:data', async (ctx) => {

  const center = ctx.me.username;
  const userid = ctx.from?.id+"";
  const expiration = Date.now() + 6000_000; // valid for 100 minutes
  const message = JSON.stringify({
    username: userid,
    expiration,
  });
  const authCode = await adminAccount.signMessage({
    message,
  });
  const url = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}`




  const data = ctx.callbackQuery.data;

  if (data === "start") {

    const keyboard = new InlineKeyboard()
    .webApp('마이 페이지 앱 시작하기', url)
    .row()
    .text("총 거래 계정 보기", "totalTradingAccountBalance")
    .row()
    .text("설명", "about");

    return ctx.reply(
      'OKX AI 에이전트 봇',
      { reply_markup: keyboard}
    )
  } else if (data === "totalTradingAccountBalance") {



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


      
      const totalCount = data.result.totalCount;
      
      const totalTradingAccountBalance = data.result.totalTradingAccountBalance;

      const applications = data.result.applications;


      const keyboard = new InlineKeyboard()
      .text("총 거래 계정 수: " + totalCount)
      .row()
      .text("총 거래 계정 잔고: " + "$" + totalTradingAccountBalance.toFixed(2))
      .row()
      .text("처음으로 돌아가기", "start");
  

      return ctx.reply(
        "총 거래 계정\n\n",
        { reply_markup: keyboard}
      );
    }

  } else if (data === "about") {

    const keyboard = new InlineKeyboard()
    .text("처음으로 돌아가기", "start");

    return ctx.reply(
      '설명\n\nOKX AI 에이전트 봇은 OKX AI 에이전트 프로그램의 텔레그램 채팅 봇입니다. OKX AI 에이전트 프로그램은 OKX AI 에이전트 봇을 통해 OKX AI 에이전트 플랫폼에 접속할 수 있습니다.',
      { reply_markup: keyboard}
    )
  }

} );


/*
feature.command('about', async (ctx) => {

  console.log('about command')

  const center = ctx.me.username;

  console.log('center', center);

  return ctx.reply(
    'OKX AI 에이전트 봇은 OKX AI 에이전트 프로그램의 텔레그램 채팅 봇입니다. OKX AI 에이전트 프로그램은 OKX AI 에이전트 봇을 통해 OKX AI 에이전트 플랫폼에 접속할 수 있습니다.',
  )

})
*/




export { composer as startFeature }
