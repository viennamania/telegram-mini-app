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
/*
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
    // english
    //return ctx.reply('🚫 You cannot chat.\n\n👉 Please use the menu on the bottom left.\n\n🔜 General chat will be available soon')
  }

  return next()
})
  */




const adminAccount = privateKeyToAccount({
  privateKey: process.env.ADMIN_SECRET_KEY as string,
  client: createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID as string }),
})





feature.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;

  ////return ctx.reply(data);
  

  if (data === "roulette") {

    //const center = ctx.me.username+"";
    //const url = `${process.env.FRONTEND_APP_ORIGIN}/leaderboard?center=${center}`;

    //return ctx.answerCallbackQuery({ url });

    /*
    await ctx.reply("Hi! I can only read messages that explicitly reply to me!", {
      // Make Telegram clients automatically show a reply interface to the user.
      reply_markup: { force_reply: true },
    });
    */

    //return ctx.reply("안녕");


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
    }

    const dataGetUser = await responseGetUser.json();
    //console.log("data", data);

    if (!dataGetUser?.result?.walletAddress) {
      return ctx.reply("Failed to get wallet address");
    }
    
    const walletAddress = dataGetUser.result.walletAddress;



    const urlSetGame = `${process.env.FRONTEND_APP_ORIGIN}/api/game/setGame`;
  
    const responseSetGame = await fetch(urlSetGame, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
      }),
    });

    if (responseSetGame.status !== 200) {
      return ctx.reply("Failed to set game");
    }

    const dataSetGame = await responseSetGame.json();

    //console.log("dataSetGame=", dataSetGame);

    const sequence = dataSetGame?.result?.sequence;

    //console.log("sequence=", sequence);

    if (!sequence) {
      return ctx.reply("Failed to set game");
    }



    const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-wins.jpg`;
    
    const text = '✅ ' + sequence + '회차 홀짝게임을 시작합니다.'
      + '\n\n👇 아래 버튼에서 홀 또는 짝을 선택하세요.';

    const queryDataOdd = 'roulette-odd' + '-' + sequence;
    const queryDataEvent = 'roulette-even' + '-' + sequence;

    const keyboard = new InlineKeyboard()
      //.text('🎲 홀', 'roulette-odd').text('🎲 짝', 'roulette-even')
      .text('🎲 홀', queryDataOdd).text('🎲 짝', queryDataEvent)


    return ctx.replyWithPhoto(
      photoUrl,
      {
        caption: text,
        reply_markup: keyboard
      }
    )



  //} else if (data === "roulette-odd" || data === "roulette-even") {

  } else if (data.startsWith("roulette-")) {

    // roulette-odd-1
    // roulette-even-1

    // odd or even
    // 1 or 2 or 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10

    const dataSplit = data.split('-');

    const oddOrEven = dataSplit[1];
    const selectedSequence = dataSplit[2];

    console.log('oddOrEven', oddOrEven);
    console.log('selectedSequence', selectedSequence);




    const randomNumber = Math.floor(Math.random() * 2);
    const result = randomNumber === 0 ? "짝" : "홀";
    const win = (data === "roulette-odd" && randomNumber === 1) || (data === "roulette-even" && randomNumber === 0);

    //return ctx.answerCallbackQuery(`랜덤 숫자: ${randomNumber}\n결과: ${result}\n${win ? "당첨" : "꽝"}`);

    let photoUrl = '';
    let text = '';







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
    }

    const dataUser = await responseGetUser.json();
    //console.log("dataUser", dataUser);

    if (!dataUser?.result?.walletAddress) {
      return ctx.reply("Failed to get wallet address");
    }
    
    const walletAddress = dataUser.result.walletAddress;



    const urlSetGame = `${process.env.FRONTEND_APP_ORIGIN}/api/game/setGame`;
  
    const responseSetGame = await fetch(urlSetGame, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
      }),
    });

    if (responseSetGame.status !== 200) {
      return ctx.reply("Failed to set game 1");
    }

    const dataSetGame = await responseSetGame.json();

    console.log("dataSetGame=", dataSetGame);

    const sequence = dataSetGame?.result?.sequence;

    //console.log("sequence=", sequence);

    if (!sequence) {
      return ctx.reply("Failed to set game 2");
    }





    if (win) {

      photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-wins.jpg`;


      if (data === "roulette-odd") {
        text = '✅ 홀을 선택하셨습니다.'
          + '\n\n결과: ' + randomNumber + ', ' + result + '\n\n✅ 당첨!!!'
          //+ '\n\n✅ ' + sequence + '회차 홀짝게임을 시작합니다.'
          //+ '\n\n👇 아래 버튼에서 홀 또는 짝을 선택하세요.';
      }
      if (data === "roulette-even") {
        text = '✅ 짝을 선택하셨습니다.'
          + '\n\n결과: ' + randomNumber + ', ' + result + '\n\n✅ 당첨!!!'
          //+ '\n\n✅ ' + sequence + '회차 홀짝게임을 시작합니다.'
          //+ '\n\n👇 아래 버튼에서 홀 또는 짝을 선택하세요.';
      }

    } else {

      photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-lose.jpg`;

      if (data === "roulette-odd") {
        text = '✅ 홀을 선택하셨습니다.'
        + '\n\n결과: ' + randomNumber + ', ' + result + '\n\n✅ 꽝!!!'
        //+ '\n\n✅ ' + sequence + '회차 홀짝게임을 시작합니다.'
        //+ '\n\n👇 아래 버튼에서 홀 또는 짝을 선택하세요.';
      }

      if (data === "roulette-even") {
        text = '✅ 짝을 선택하셨습니다.'
        + '\n\n결과: ' + randomNumber + ', ' + result + '\n\n✅ 꽝!!!'
        //+ '\n\n✅ ' + sequence + '회차 홀짝게임을 시작합니다.'
        //+ '\n\n👇 아래 버튼에서 홀 또는 짝을 선택하세요.';
      }

    }

    //const keyboard = new InlineKeyboard()
    //  .text('🎲 홀', 'roulette-odd').text('🎲 짝', 'roulette-even')

    const keyboard = new InlineKeyboard()
      .text('🎲 홀짝게임 시작하기', 'roulette')



    return ctx.replyWithPhoto(
      photoUrl,
      {
        caption: text,
        reply_markup: keyboard
      }
    )

    
  } else if (data === "my-profile") {
    
    const center = ctx.me.username+"";
    const telegramId = ctx.from?.id+"";

    const username = ctx.from?.id+"";
    const expiration = Date.now() + 60000_000; // valid for 100 minutes
    const message = JSON.stringify({
      username,
      expiration,
    });

    const authCode = await adminAccount.signMessage({
      message,
    });

    const url = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&telegramId=${telegramId}&path=/my-profile`;

    return ctx.answerCallbackQuery({ url });
  }

  return ctx.answerCallbackQuery("Not implemented");

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
      const expiration = Date.now() + 60000_000; // valid for 100 minutes
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

      const urlSellUsdt = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/kr/sell-usdt`;
      const urlBuyUsdt = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/kr/buy-usdt`;


      const keyboard = new InlineKeyboard()
        .webApp('💰 USDT 판매하기', urlSellUsdt)
        .row()
        .webApp('💰 USDT 구매하기', urlBuyUsdt)



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
      const expiration = Date.now() + 60000_000; // valid for 100 minutes
      const message = JSON.stringify({
        username,
        expiration,
      });
    
      const authCode = await adminAccount.signMessage({
        message,
      });






      const urlGame = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/game`;

      const urlGameGranderby = `${process.env.FRONTEND_APP_ORIGIN}/en/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/en/granderby`;


      const text = '\n\n✅ 지갑주소: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      + '\n\n' + '✅ 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 게임으로 이동하세요.';
      // english
      //+ '\n\n' + '✅ Wallet Address: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      //+ '\n\n' + '✅ Wallet Balance: ' + balance + ' USDT\n\n' + '👇 Press the button below to go to the game.';

      const keyboard = new InlineKeyboard()
        //.webApp('💰 게임하러가기', urlGame)
        // english
        //.webApp('💰 Go to the game', urlGame)

        .webApp('🎮 Go to Tap to Earn Game', urlGame)
        .row()
        .webApp('🎮 Go to Granderby Game', urlGameGranderby)
        .row()
        .text('🎲 홀짝게임 시작하기', 'roulette')

      const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/logo-sports-game.jpg`;


      
      return ctx.replyWithPhoto(
        photoUrl,
        {
          caption: text,
          reply_markup: keyboard
        }
      )
      

      /*
      const videoUrl = `${process.env.FRONTEND_APP_ORIGIN}/connecting.gif`;
      const videoFile = new InputFile(videoUrl)

      ctx.replyWithVideo(
        videoFile,
        {
          caption: text,
          reply_markup: keyboard
        }
      )
      */



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
      const expiration = Date.now() + 60000_000; // valid for 100 minutes
      const message = JSON.stringify({
        username,
        expiration,
      });
    
      const authCode = await adminAccount.signMessage({
        message,
      });

      const urlMyWallet = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-wallet`;

      const urlMyNft = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-nft-erc1155-noah`;


      const text = '\n\n✅ 지갑주소: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      + '\n\n' + '✅ 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 나의 지갑으로 이동하세요.';
      // english
      //+ '\n\n' + '✅ Wallet Address: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      //+ '\n\n' + '✅ Wallet Balance: ' + balance + ' USDT\n\n' + '👇 Press the button below to go to my wallet.'
  
      const keyboard = new InlineKeyboard()
        .webApp('💰 나의 코인 보러가기', urlMyWallet)
        .row()
        .webApp('💰 나의 NOAH 채굴 NFT 보러가기', urlMyNft)
        // english
        //.webApp('💰 Go to my wallet', urlMyWallet)

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




  let welecomePhoto = `${process.env.FRONTEND_APP_ORIGIN}/logo-ai-agent.jpeg`;



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

      const welecomeVideo = `${process.env.FRONTEND_APP_ORIGIN}/logo-centerbot.gif`;

      const videoFile = new InputFile(`/home/ubuntu/video/logo-centerbot.gif`)

      //const videoFile = new InputFile(welecomeVideo)
      
      /*
      const keyboard = new InlineKeyboard()
      .text("ABCD")
      .row()
      //.webApp('소속 센터봇으로 이동하기', '@owin_anawin_bot')
      //.url('소속 센터봇으로 이동하기', 'https://t.me/owin_anawin_bot')
      .url('소속 센터봇으로 이동하기', 'https://naver.com')
      */
      
      /*
      return ctx.replyWithPhoto(
        welecomePhoto,
        {
          caption: "🚫 당신은 이 봇을 사용할 수 없습니다.\n\n" + "소속 센터봇: " + data.result.center,
          // english
          //caption: "🚫 You cannot use this bot.\n\n" + "Center Bot: " + data.result.center,
          //reply_markup: keyboard
        }
      )
      */

      return ctx.replyWithVideo(
        videoFile,
        {
          caption: "🚫 당신은 이 봇을 사용할 수 없습니다.\n\n" + "소속 센터봇: " + data.result.center,
          // english
          //caption: "🚫 You cannot use this bot.\n\n" + "Center Bot: " + data.result.center,
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









  const expiration = Date.now() + 60000_000; // valid for 100 minutes
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


  const urlNft = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-nft-erc1155-noah`;


  const urlNftBuy = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-nft-erc1155-noah-buy`;


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

    welecomePhoto = `${process.env.FRONTEND_APP_ORIGIN}/logo-ai-agent.jpeg`;
    
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

    /*
    .row()
    .webApp('💰 나의 NOAH 채굴 NFT 보러가기', urlNft)
    .row()
    .webApp('💰 나의 NOAH 채굴 NFT 구매신청하기', urlNftBuy)
    */


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






feature.command('noah', async (ctx) => {

  console.log('noah command');

  const center = ctx.me.username;

  const telegramId = ctx.from?.id+"";


  const username = ctx.from?.id+"";




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



  const expiration = Date.now() + 60000_000; // valid for 100 minutes
  const message = JSON.stringify({
    username,
    expiration,
  });

  const authCode = await adminAccount.signMessage({
    message,
  });


  const urlMyProfile = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&telegramId=${telegramId}&path=/my-profile`;

  const urlNft = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-nft-erc1155-noah`;


  const urlNftBuy = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-nft-erc1155-noah-buy`;


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




  //const urlMarket = 'https://www.lbank.com/trade/noah_usdt';

  const urlMarket = 'https://m.lbank.com/market/usdt/noah_usdt';

  const videoFile = new InputFile(`/home/ubuntu/video/noah10000.mp4`)
  
            //await botInstance.api.sendVideo(
            //  telegramId,
            //  videoFile,




  let keyboard = null;
  
  if (referralCode || isCenterOwner) {
    keyboard = new InlineKeyboard()
    .webApp('💰 나의 NOAH 채굴 NFT 보러가기', urlNft)
    .row()
    .webApp('💰 나의 NOAH 채굴 NFT 구매신청하기', urlNftBuy)
    .row()
    .webApp('💹 NOAH 코인 시세보기', urlMarket);



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



  const title = 'NOAH SKY에 오신것을 환영합니다.'
  + (nickname ? '\n\n✅ 회원아이디: ' + nickname : '')
  + (walletAddress ? '\n\n✅ 나의 지갑주소: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6) : '')
  + '\n\n' + referralCodeText
  + '\n\n' + '👇 아래 메뉴를 선택하세요.'

  // english
  //+ '\n\n' + '👇 Please select the menu below.'

  //const photoFile = new InputFile(`${process.env.FRONTEND_APP_ORIGIN}/logo-tbot-100.png`)

  /*
  return ctx.replyWithPhoto(
    //photoFile,
    //`${process.env.FRONTEND_APP_ORIGIN}/logo-tbot-100.png`,
    welecomePhoto,
    {
      caption: title,
      reply_markup: keyboard
    }
  )
    */

  return ctx.replyWithVideo(
    //photoFile,
    //`${process.env.FRONTEND_APP_ORIGIN}/logo-tbot-100.png`,
    videoFile,
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







// public chat
const publicChat = composer.chatType('group');

// if feature is not command, reply with the help message

/*
publicChat.use((ctx, next) => {


  console.log('public chat');
  console.log('ctx.message', ctx.message);



  if (ctx.message && ctx.message.text) {
    return ctx.reply(ctx.message.text);
  }


  return next()
})
*/



// show game
publicChat.command('game', async (ctx) => {

  const text = "복권방";
  const urlGame = "https://naver.com";

  const keyboard = new InlineKeyboard()
    .webApp('💰 게임하러가기', urlGame)
    // english
    //.webApp('💰 Go to the game', urlGame)


  return ctx.reply(
    '🚫 준비중입니다.'
  )


})





publicChat.command('wallet', async (ctx) => {

  const text = "복권방";
  const urlGame = "https://naver.com";

  const keyboard = new InlineKeyboard()
    .webApp('💰 게임하러가기', urlGame)
    // english
    //.webApp('💰 Go to the game', urlGame)


  return ctx.reply(
    '🚫 준비중입니다.'
  )


})




publicChat.command('otc', async (ctx) => {

  const text = "복권방";
  const urlGame = "https://naver.com";

  const keyboard = new InlineKeyboard()
    .webApp('💰 게임하러가기', urlGame)
    // english
    //.webApp('💰 Go to the game', urlGame)


  return ctx.reply(
    '🚫 준비중입니다.'
  )


})

publicChat.command('start', async (ctx) => {

  const text = "복권방";
  const urlGame = "https://naver.com";

  const keyboard = new InlineKeyboard()
    .webApp('💰 게임하러가기', urlGame)
    // english
    //.webApp('💰 Go to the game', urlGame)


  return ctx.reply(
    '🚫 준비중입니다.'
  )


})




export { composer as startFeature }
