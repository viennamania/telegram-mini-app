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

  console.log('start command');

  const center = ctx.me.username;

  const telegramId = ctx.from?.id+"";


  const username = ctx.from?.id+"";



  let referralCode = "";

  // get parameters from the context

  const params = ctx.message?.text?.split(' ');

  console.log('params', params); // params [ '/start', '34' ]

  const paramReferralCode = params[1];

  if (paramReferralCode) {
    //console.log('paramReferralCode', paramReferralCode);

    const urlApplyReferralCode = `${process.env.FRONTEND_APP_ORIGIN}/api/referral/applyReferralCode`;

    const responseApplyReferralCode = await fetch(urlApplyReferralCode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegramId,
        referralCode: paramReferralCode,
      }),
    });

    if (responseApplyReferralCode.status !== 200) {
      return ctx.reply("Failed to apply referral code");
    } else {
      const data = await responseApplyReferralCode.json();
      //console.log("data", data);

      referralCode = paramReferralCode;
    }

  } else {

    const urlGetReferralCode = `${process.env.FRONTEND_APP_ORIGIN}/api/referral/getReferralCode`;

    const responseGetReferralCode = await fetch(urlGetReferralCode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegramId,
      }),
    });

    if (responseGetReferralCode.status !== 200) {
      return ctx.reply("Failed to get referral code");
    } else {
      const data = await responseGetReferralCode.json();
      ///console.log("data", data);

      referralCode = data.result.referralCode;
    }

  }

  ///console.log('referralCode', referralCode);












  const expiration = Date.now() + 6000_000; // valid for 100 minutes
  const message = JSON.stringify({
    username,
    expiration,
  });

  const authCode = await adminAccount.signMessage({
    message,
  });

  const url = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&telegramId=${telegramId}&path=/`;


  const urlTbot = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&telegramId=${telegramId}&path=/tbot`;


  const urlReferral = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&telegramId=${telegramId}&path=/referral`;


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
    .text('나의 레퍼럴코드: ' + referralCode)
    .row()
    .webApp('마이 페이지 보러가기', url)
    .row()
    .webApp('나의 AI 에이전트 보러가기', urlReferral)
    .row()
    .webApp('나의 OKX 트레이딩 봇 보러가기', urlTbot)
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
