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


  let nickname = "";
  let referralCode = "";
  let isCenterOwner = false;

  const urlGetUser = `${process.env.FRONTEND_APP_ORIGIN}/api/user/getUserByTelegramId`;

  const responseGetUser = await fetch(urlGetUser, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      telegramId,
    }),
  });

  if (responseGetUser.status !== 200) {
    return ctx.reply("Failed to get user");
  } else {
    const data = await responseGetUser.json();
    //console.log("data", data);

    if (data.result && data.result.centerOwner) {
      isCenterOwner = data.result.centerOwner;
    }

    if (data.result && data.result.nickname) {
      nickname = data.result.nickname;
    }
  }

  console.log('isCenterOwner', isCenterOwner);




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

    if (data.result) {
      referralCode = data.result.referralCode;
    }
  }






  // get parameters from the context

  const params = ctx.message?.text?.split(' ');

  console.log('params', params); // params [ '/start', '0x1680535B95Fc2b5b18E7c201b41Ff0327f7b54fb_0' ]

  const paramReferralCode = params[1];

  //console.log('paramReferralCode', paramReferralCode);

  


  if (!referralCode && paramReferralCode) {


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

  }

  //console.log('referralCode', referralCode);












  const expiration = Date.now() + 6000_000; // valid for 100 minutes
  const message = JSON.stringify({
    username,
    expiration,
  });

  const authCode = await adminAccount.signMessage({
    message,
  });

  //const url = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&telegramId=${telegramId}&path=/`;
  const urlLeaderBoard = `${process.env.FRONTEND_APP_ORIGIN}/leaderboard?center=${center}`;

  const urlMyProfile = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-profile`;

  const urlTbot = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&referralCode=${referralCode}&path=/tbot`;


  const urlReferral = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/referral`;

  const urlMasterbot = `${process.env.FRONTEND_APP_ORIGIN}/masterbot?center=${center}`;

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
    ///return ctx.reply("Failed to get leaderboard");
  } else {

    const data = await response.json();

    //console.log("data", data);

    totalAccountCount = data.result.totalCount;
      
    totalTradingAccountBalance = data.result.totalTradingAccountBalance

    ///const applications = data.result.applications;



    
  }



  let referralCodeText = referralCode ? '나의 레퍼럴코드: ' + referralCode.slice(0, 6) + '...' + referralCode.slice(-6)
   : '레퍼럴코드가 없습니다.';

  if (isCenterOwner) {
    referralCodeText = '당신은 센터장입니다.';
  }

  let keyboard = null;
  
  if (referralCode || isCenterOwner) {
    keyboard = new InlineKeyboard()
    .text(referralCodeText)
    .row()
    .webApp('나의 프로필 보러가기', urlMyProfile)
    .row()
    
    //.webApp('마이 페이지 보러가기', url)
    .webApp('회원 보러가기', urlLeaderBoard)

    .row()
    .webApp('나의 AI 에이전트 보러가기', urlReferral)
    .row()
    .webApp('나의 OKX 트레이딩 봇 보러가기', urlTbot)

    //if (isCenterOwner) {
      keyboard.row()
      .webApp('전체 가입자 보러가기', urlMasterbot)
    //}



  } else {
    keyboard = new InlineKeyboard()
    .text('레퍼럴코드를 발급받으세요.')
    .row()
    .webApp('나의 프로필 설정하기', urlMyProfile)
    .row()
    .webApp('회원 보러가기', urlLeaderBoard)
  }








    /*
    .row()
    .text("총 계정 수: " + totalAccountCount)
    .row()
    .text("총 거래 잔고: " + "$" + Number(totalTradingAccountBalance).toFixed(2))
    */

    const title = 'OKX AI 봇 센터에 오신것을 환영합니다.'
    + (nickname ? '\n회원아이디: ' + nickname : '');
  
  return ctx.reply(
    title,
    { reply_markup: keyboard}
  )

})




export { composer as startFeature }
