import { Composer, InlineKeyboard, InputFile } from 'grammy'
import type { Context } from './context.js'
import { privateKeyToAccount } from 'thirdweb/wallets'
import { createThirdwebClient } from 'thirdweb'
import { config } from 'dotenv' 
import { set } from 'valibot'
config()







import {
  getContract,
} from "thirdweb";

import {
  polygon,
  arbitrum,
  ethereum,
} from "thirdweb/chains";

import { balanceOf } from "thirdweb/extensions/erc20";
import { url } from 'inspector'




const composer = new Composer<Context>()

const feature = composer.chatType('private')



// if feature is not command, reply with the help message
feature.use((ctx, next) => {
  if (!ctx.message?.text?.startsWith('/')) {

    // 일반 대화는 할수 없습니다.
    // 좌측 하단의 메뉴를 이용해주세요.
    // 곧 일반 대화도 가능하게 업데이트 될 예정입니다.
    return ctx.reply(
      '🚫 일반 대화는 할수 없습니다.\n\n'
      + '👉 좌측 하단의 메뉴를 이용해주세요.\n\n'
      + '🔜 곧 일반 대화도 가능하게 업데이트 될 예정입니다.'
    )
  }
  return next()
})




const adminAccount = privateKeyToAccount({
  privateKey: process.env.ADMIN_SECRET_KEY as string,
  client: createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID as string }),
})






// show otc
feature.command('otc', async (ctx) => {

  console.log('otc command');
  
  const telegramId = ctx.from?.id+"";

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

    if (data.result && data.result.walletAddress) {
      const walletAddress = data.result.walletAddress;


      // get balance
      const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon
      const clientId = process.env.THIRDWEB_CLIENT_ID;
      const client = createThirdwebClient({
        clientId: clientId as string,
      });
      const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
      });

      const result = await balanceOf({
        contract,
        address: walletAddress,
      });

      const balance = Number(result) / 10 ** 6;



      const center = ctx.me.username+"";
      const username = ctx.from?.id+"";
      const expiration = Date.now() + 6000_000; // valid for 100 minutes
      const message = JSON.stringify({
        username,
        expiration,
      });
    
      const authCode = await adminAccount.signMessage({
        message,
      });

  
      const urlOtc = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/otc`;



      console.log('urlOtc', urlOtc);

      const text = '\n\n✅ 지갑주소: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      + '\n\n' + '✅ 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 USDT 판매/구매 하세요.';

      // english
      //+ '\n\n' + '✅ Wallet Address: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      //+ '\n\n' + '✅ Wallet Balance: ' + balance + ' USDT\n\n' + '👇 Press the button below to sell/buy USDT.';

      const keyboard = new InlineKeyboard()
        .webApp('💰 USDT 판매하기', urlOtc)
        .row()
        .webApp('💰 USDT 구매하기', urlOtc)



      //const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/logo-otc.jpg`; // error

      const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/logo-otc.webp`;

      ///const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/logo-sports-game.jpg`;


      return ctx.replyWithPhoto(
        photoUrl,
        {
          caption: text,
          reply_markup: keyboard
        }
      )

    }
  }

  return ctx.reply("Failed to get wallet address");

})








// show game
feature.command('game', async (ctx) => {
  
  const telegramId = ctx.from?.id+"";

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

    if (data.result && data.result.walletAddress) {
      const walletAddress = data.result.walletAddress;


      // get balance
      const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon
      const clientId = process.env.THIRDWEB_CLIENT_ID;
      const client = createThirdwebClient({
        clientId: clientId as string,
      });
      const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
      });

      const result = await balanceOf({
        contract,
        address: walletAddress,
      });

      const balance = Number(result) / 10 ** 6;



      const center = ctx.me.username+"";
      const username = ctx.from?.id+"";
      const expiration = Date.now() + 6000_000; // valid for 100 minutes
      const message = JSON.stringify({
        username,
        expiration,
      });
    
      const authCode = await adminAccount.signMessage({
        message,
      });


      const urlGame = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/game`;


      const text = '\n\n✅ 지갑주소: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      + '\n\n' + '✅ 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 게임으로 이동하세요.';
      // english
      //+ '\n\n' + '✅ Wallet Address: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      //+ '\n\n' + '✅ Wallet Balance: ' + balance + ' USDT\n\n' + '👇 Press the button below to go to the game.';

      const keyboard = new InlineKeyboard()
        .webApp('💰 게임하러가기', urlGame)
        // english
        //.webApp('💰 Go to the game', urlGame)

      const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/logo-sports-game.jpg`;

      return ctx.replyWithPhoto(
        photoUrl,
        {
          caption: text,
          reply_markup: keyboard
        }
      )

    }
  }

  return ctx.reply("Failed to get wallet address");

})






// show wallet address and balance
feature.command('wallet', async (ctx) => {
  
  const telegramId = ctx.from?.id+"";

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

    if (data.result && data.result.walletAddress) {
      const walletAddress = data.result.walletAddress;


      // get balance
      const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon
      const clientId = process.env.THIRDWEB_CLIENT_ID;
      const client = createThirdwebClient({
        clientId: clientId as string,
      });
      const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
      });

      const result = await balanceOf({
        contract,
        address: walletAddress,
      });

      const balance = Number(result) / 10 ** 6;



      const center = ctx.me.username+"";
      const username = ctx.from?.id+"";
      const expiration = Date.now() + 6000_000; // valid for 100 minutes
      const message = JSON.stringify({
        username,
        expiration,
      });
    
      const authCode = await adminAccount.signMessage({
        message,
      });

      const urlMyWallet = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-wallet`;


      const text = '\n\n✅ 지갑주소: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      + '\n\n' + '✅ 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 나의 지갑으로 이동하세요.';
      const keyboard = new InlineKeyboard()
        .webApp('💰 나의 지갑 보러가기', urlMyWallet)

      const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/logo-magic-wallet.webp`;

      return ctx.replyWithPhoto(
        photoUrl,
        {
          caption: text,
          reply_markup: keyboard
        }
      )

      /*
      return ctx.reply(
        text,
        { reply_markup: keyboard}
      );
      */


      /*
      return ctx.reply(
        "지갑주소: " + walletAddress
        + "\n" + "잔고: " + balance + " USDT"
      );
      */

    }
  }

  return ctx.reply("Failed to get wallet address");

})




feature.command('start', async (ctx) => {

  console.log('start command');

  const center = ctx.me.username;

  const telegramId = ctx.from?.id+"";


  const username = ctx.from?.id+"";




  let welecomePhoto = `${process.env.FRONTEND_APP_ORIGIN}/logo-tbot-100.png`;



  let nickname = "";
  let walletAddress = "";
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


    if (data.result && data.result.center !== center) {

      // 당신을 봇을 사용할 수 없습니다.
      // link to the center

      const welecomePhoto = `${process.env.FRONTEND_APP_ORIGIN}/logo-centerbot.png`;
      
      /*
      const keyboard = new InlineKeyboard()
      .text("ABCD")
      .row()
      //.webApp('소속 센터봇으로 이동하기', '@owin_anawin_bot')
      //.url('소속 센터봇으로 이동하기', 'https://t.me/owin_anawin_bot')
      .url('소속 센터봇으로 이동하기', 'https://naver.com')
      */
      

      return ctx.replyWithPhoto(
        welecomePhoto,
        {
          caption: "🚫 당신은 이 봇을 사용할 수 없습니다.\n\n" + "소속 센터봇: " + data.result.center,
          //reply_markup: keyboard
        }
      )



    }



    if (data.result && data.result.centerOwner

      && data.result.center === center
    ) {
      
      isCenterOwner = true;

    }

    if (data.result && data.result.walletAddress) {
      walletAddress = data.result.walletAddress;
    }

    if (data.result && data.result.nickname) {
      nickname = data.result.nickname;
    }


  }

  //console.log('isCenterOwner', isCenterOwner);
  //console.log('walletAddress', walletAddress);




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





  /*
  let masterBotInfo = null;


  const urlMyApplication = `${process.env.FRONTEND_APP_ORIGIN}/api/agent/getOneApplicationByWalletAddress`;

  const responseMyApplication = await fetch(urlMyApplication, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress,
    }),
  });

  if (responseMyApplication.status !== 200) {
    return ctx.reply("Failed to get my application");
  } else {
    const data = await responseMyApplication.json();
    ///console.log("data", data);

    if (data.result) {
      masterBotInfo = data.result.masterBotInfo;
    }
  }
  */









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

  const urlMyProfile = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&telegramId=${telegramId}&path=/my-profile`;

  const urlTbot = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&referralCode=${referralCode}&path=/tbot`;


  const urlReferral = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/referral`;

  const urlMasterbot = `${process.env.FRONTEND_APP_ORIGIN}/masterbot?center=${center}`;

  const urlClaim = `${process.env.FRONTEND_APP_ORIGIN}/claim?walletAddress=${walletAddress}`;

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
      
    totalTradingAccountBalance = data.result.totalTradingAccountBalance;

    

    ///const applications = data.result.applications;



    
  }





  if (
    isCenterOwner
  ) {
    welecomePhoto = `${process.env.FRONTEND_APP_ORIGIN}/logo-centerbot.png`;
  } else {

    /*
    if (masterBotInfo) {
      welecomePhoto = masterBotInfo.imageUrl;
    } else {
      welecomePhoto = `${process.env.FRONTEND_APP_ORIGIN}/logo-tbot-100.png`;
    }
    */

    welecomePhoto = `${process.env.FRONTEND_APP_ORIGIN}/logo-tbot-100.png`;
    
  }

  let keyboard = null;
  
  if (referralCode || isCenterOwner) {
    keyboard = new InlineKeyboard()
    //.text(referralCodeText)
    .row()
    .webApp('🚻 나의 프로필 보러가기', urlMyProfile)
    .row()
    .webApp('🤖 나의 에이전트봇 보러가기', urlReferral)
    .row()
    .webApp('🤖 나의 마스터봇 보러가기', urlTbot)
    .row()
    .webApp('💰 나의 마스트봇 보상내역 보러가기', urlClaim)

    if (isCenterOwner) {

      keyboard.row()
      .webApp('회원 보러가기', urlLeaderBoard)

      keyboard.row()
      .webApp('OKX 가입자 보러가기', urlMasterbot)

      //keyboard.row()
      //.game('게임하기')
    }

    // 고객센터 @magic_wallet_cs
    // https://t.me/magic_wallet_cs

    //keyboard.row()
    //.text('고객센터 @magic_wallet_cs')



  } else {
    keyboard = new InlineKeyboard()
    .text('🚫 봇센터에서 레퍼럴코드를 발급받아야 사용할 수 있습니다.')
    // english
    //.text('🚫 You need to get a referral code from the bot center to use it.')

    .row()
    .webApp('⚙️ 회원아이디를 설정해주세요.', urlMyProfile)
    // english
    //.webApp('⚙️ Set your nickname.', urlMyProfile)

    //.row()
    //.webApp('회원 보러가기', urlLeaderBoard)
  }




  /*
  .row()
  .text("총 계정 수: " + totalAccountCount)
  .row()
  .text("총 거래 잔고: " + "$" + Number(totalTradingAccountBalance).toFixed(2))
  */




  let referralCodeText = "";

  if (isCenterOwner) {
   referralCodeText = '✅ 당신은 센터장입니다.';
  } else {
    referralCodeText = referralCode ? '✅ 나의 레퍼럴코드: ' + referralCode.slice(0, 6) + '...' + referralCode.slice(-6)
    : '🚫 레퍼럴코드가 없습니다.'; 
    // english
    //referralCodeText = referralCode ? '✅ My Referral Code: ' + referralCode.slice(0, 6) + '...' + referralCode.slice(-6)
    //: '🚫 There is no referral code.';
  }



  const title = 'AI 봇 센터에 오신것을 환영합니다.'
  + (nickname ? '\n\n✅ 회원아이디: ' + nickname : '')
  + (walletAddress ? '\n\n✅ 나의 지갑주소: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6) : '')
  + '\n\n' + referralCodeText
  + '\n\n' + '👇 아래 메뉴를 선택하세요.'
  
  // english
  //+ '\n\n' + '👇 Please select the menu below.'

  //const photoFile = new InputFile(`${process.env.FRONTEND_APP_ORIGIN}/logo-tbot-100.png`)


  return ctx.replyWithPhoto(
    //photoFile,
    //`${process.env.FRONTEND_APP_ORIGIN}/logo-tbot-100.png`,
    welecomePhoto,
    {
      caption: title,
      reply_markup: keyboard
    }
  )

  /*
  return ctx.reply(
    title,
    { reply_markup: keyboard}
  )
  */

  //return ctx.replyWithGame('tictactoe')

})








export { composer as startFeature }
