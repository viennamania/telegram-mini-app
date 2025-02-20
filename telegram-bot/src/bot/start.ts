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


  if (data === "centerbot-") {

    const dataSplit = data.split('-');

    const changedCenter = dataSplit[1];



    const telegramId = ctx.from?.id+"";

    const urlGetUser = `${process.env.FRONTEND_APP_ORIGIN}/api/user/setUserCenterByTelegramId`;
  
    const responseGetUser = await fetch(urlGetUser, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegramId: telegramId,
        center: changedCenter,
      }),
    });
  
    if (responseGetUser.status !== 200) {
      return ctx.reply("Failed to change center");
    }

    ctx.reply("센터가 변경되었습니다.");




  } else if (data === "race") {


    ctx.reply('🐎 ' + "경마게임을 시작합니다. 출전마를 배정중이니 잠시만 기다려주세요...");


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



    const urlSetGame = `${process.env.FRONTEND_APP_ORIGIN}/api/game/setRaceGame`;
  
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

    const status = dataSetGame?.result?.status;

    if (status === 'waiting') {

      const sequence = parseInt(dataSetGame?.result?.data?.sequence) + 1;

      const waitingTime = dataSetGame?.result?.waitingTime;

      const sequenceString = sequence.toString();
      let sequenceEmoji = '';
      for (let i = 0; i < sequenceString.length; i++) {
        sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
      }

      const text = sequenceEmoji + '회차 경마 게임을 시작합니다.'
      + '\n\n⏱️ ' + waitingTime + '초 후에 게임을 시작할수 있습니다. 🙏 잠시만 기다려주세요.'
      + '\n\n👇 아래 버튼을 눌러 경마 게임을 시작하세요';

      //return ctx.reply(text);

      const keyboard = new InlineKeyboard()
      .text(sequenceEmoji + '회차 경마 게임 시작하기', 'race')
    
      //const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-waiting.jpg`;
      const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/horse-racing-waiting-banner.jpg`;

      return ctx.replyWithPhoto(
        photoUrl,
        {
          caption: text,
          reply_markup: keyboard
        }
      )
    
    }

    let sequence;

    if (status === "success") {

      sequence = dataSetGame?.result?.data?.sequence;

    //console.log("sequence=", sequence);

      if (!sequence) {
        return ctx.reply("🚫 Failed to set game");
      }

    }


    const winPrize = dataSetGame?.result?.data?.winPrize;

    /*
    {
  "_id": {
    "$oid": "67b07fc360627660391dc048"
  },
  "walletAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
  "sequence": 22,
  "status": "opened",
  "winPrize": "1.594177",
  "horses": [
    {
      "tokenId": 116
    },
    {
      "tokenId": 992
    },
    {
      "tokenId": 7276
    },
    {
      "tokenId": 8993
    },
    {
      "tokenId": 869
    },
    {
      "tokenId": 2514
    },
    {
      "tokenId": 7169
    },
    {
      "tokenId": 6024
    }
  ],
  "usdtAmount": 0,
  "krwAmount": 0,
  "rate": 0,
  "createdAt": "2025-02-15T11:51:31.543Z"
}
  */

    const horses = dataSetGame?.result?.data?.horses;



    const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/horse-racing-banner.jpg`;
    
    //const videoFile = new InputFile(`/home/ubuntu/video/welcome-casino.gif`)
    //const videoFile = new InputFile(`/home/ubuntu/video/banano-stom.mp4`)

      // 1️⃣ 회차
    // 2️⃣ 회차
    // 12 회차 => 1️⃣ 2️⃣ 회차
    // convert number to emoji

    const sequenceString = sequence.toString();
    let sequenceEmoji = '';
    for (let i = 0; i < sequenceString.length; i++) {
      sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
    }

    const text = sequenceEmoji + '회차 경마 게임을 시작합니다.'
      + '\n\n💲 당첨금: ' + winPrize + ' USDT'
      + '\n\n👇 아래에서 우승을 예상하는 말의 출전번호을 선택하면 경기가 시작됩니다.'

    //const queryDataOdd = 'roulette-odd' + '-' + sequence;
    //const queryDataEvent = 'roulette-even' + '-' + sequence;

    // 1번말: 116, 2번말: 992, 3번말: 7276, 4번말: 8993, 5번말: 869, 6번말: 2514, 7번말: 7169, 8번말: 6024
    const keyboard = new InlineKeyboard()
      .text('1️⃣ 번말: ' + horses[0].tokenId, 'race-1' + '-' + sequence)

      // https://granderby.io/horse-details/4149 보러가기
      .webApp('🐎 ' + horses[0].tokenId + " NFT" + ' ➡️', 'https://granderby.io/horse-details/' + horses[0].tokenId)

      .row()
      .text('2️⃣ 번말: ' + horses[1].tokenId, 'race-2' + '-' + sequence)
      .webApp('🐎 ' + horses[1].tokenId + " NFT" + ' ➡️', 'https://granderby.io/horse-details/' + horses[1].tokenId)

      .row()
      .text('3️⃣ 번말: ' + horses[2].tokenId, 'race-3' + '-' + sequence)
      .webApp('🐎 ' + horses[2].tokenId + " NFT" + ' ➡️', 'https://granderby.io/horse-details/' + horses[2].tokenId)

      .row()
      .text('4️⃣ 번말: ' + horses[3].tokenId, 'race-4' + '-' + sequence)
      .webApp('🐎 ' + horses[3].tokenId + " NFT" + ' ➡️', 'https://granderby.io/horse-details/' + horses[3].tokenId)

      .row()
      .text('5️⃣ 번말: ' + horses[4].tokenId, 'race-5' + '-' + sequence)
      .webApp('🐎 ' + horses[4].tokenId + " NFT" + ' ➡️', 'https://granderby.io/horse-details/' + horses[4].tokenId)

      .row()
      .text('6️⃣ 번말: ' + horses[5].tokenId, 'race-6' + '-' + sequence)
      .webApp('🐎 ' + horses[5].tokenId + " NFT" + ' ➡️', 'https://granderby.io/horse-details/' + horses[5].tokenId)

      .row()
      .text('7️⃣ 번말: ' + horses[6].tokenId, 'race-7' + '-' + sequence)
      .webApp('🐎 ' + horses[6].tokenId + " NFT" + ' ➡️', 'https://granderby.io/horse-details/' + horses[6].tokenId)

      .row()
      .text('8️⃣ 번말: ' + horses[7].tokenId, 'race-8' + '-' + sequence)
      .webApp('🐎 ' + horses[7].tokenId + " NFT" + ' ➡️', 'https://granderby.io/horse-details/' + horses[7].tokenId)
      

    /*
    const keyboard = new InlineKeyboard()
      .text('1️⃣', 'race-1' + '-' + sequence)
      .text('2️⃣', 'race-2' + '-' + sequence)
      .text('3️⃣', 'race-3' + '-' + sequence)
      .text('4️⃣', 'race-4' + '-' + sequence)
      .text('5️⃣', 'race-5' + '-' + sequence)
      .text('6️⃣', 'race-6' + '-' + sequence)
      .text('7️⃣', 'race-7' + '-' + sequence)
      .text('8️⃣', 'race-8' + '-' + sequence)
    */

    
    return ctx.replyWithPhoto(
      photoUrl,
      {
        caption: text,
        reply_markup: keyboard
      }
    )
    



  } else if (data.startsWith("race-")) {

    // race-1
    // race-2
    // race-3




    const dataSplit = data.split('-');

    const selectedNumber = dataSplit[1];

    const selectedSequence = dataSplit[2];
    


    if (!selectedNumber) {
      return ctx.reply("Failed to get selected number");
    }

    if (!selectedSequence) {
      return ctx.reply("Failed to get selected sequence");
    }




    ctx.reply('🐎 ' + selectedNumber + '️⃣' + ' 번말 정보를 읽어오는 중이니 잠시만 기다려주세요...');



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




    const urlGetGame = `${process.env.FRONTEND_APP_ORIGIN}/api/game/getRaceGame`;
  
    const responseGetGame = await fetch(urlGetGame, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
        sequence: selectedSequence,
      }),
    });

    if (responseGetGame.status !== 200) {
      return ctx.reply("Failed to get one game");
    }

    const dataGetGame = await responseGetGame.json();



    console.log("dataGetGame=", dataGetGame);


    const horse = dataGetGame.result?.horses[Number(selectedNumber) - 1];

    //console.log("horse=", horse);


    const horseImageUrl = horse?.nft?.metadata?.image;

    if (horseImageUrl) {

      await ctx.replyWithPhoto(
        horseImageUrl,
        {
          caption: '🐎 ' + selectedNumber + '️⃣' + ' 번 말을 우승마로 선택하셨습니다.'
        }
      )

    } else {

      await ctx.reply("🐎 " + selectedNumber + '️⃣' + ' 번 말을 우승마로 선택하셨습니다.');

    }


    const chatResponse = await ctx.reply("출발!!!");


    const timer = 50;

    const racer: number[] = [];

    // set 1 to 10 random sequence

    const racerCount = 8;

    for (let i = 0; i < racerCount; i++) {
      
      // random number between 1 and 10 and each number is unique

      let randomNumber = Math.floor(Math.random() * racerCount) + 1;

      while (racer.includes(randomNumber)) {
        randomNumber = Math.floor(Math.random() * racerCount) + 1;
      }

      racer.push(randomNumber);

    }


    ///const chatResponse = await ctx.reply("🐎 " + "경주마 배정이 완료되었습니다. 경주를 시작합니다.");

  
    /*
    const racerText = [] as string[];

    for (let j = 0; j < racerCount; j++) {
      
      if (racer[j] === parseInt(selectedNumber)) {
        racerText.push(racer[j] + '️⃣');
      } else {
        racerText.push(racer[j] + '');
      }

    }

    const textStart = timer*10 + '미터 '
      + ' ' + '🐎 ' + racerText.join(' ');

    const chatResponse = await ctx.reply(textStart);
    */
    

    for (let i = 0; i < (timer+1); i++) {

      //await ctx.reply("1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 8️⃣ 🔟");

      //await ctx.reply("⏳ " + racer.map((r) => r + '️⃣').join(' '));

      
      //const text = '🐎 ' + racer.map((r) => r).join(' ');
      // left first change to emoji


      



      //const first = racer[0] + '️⃣';

      // selectedNumber => race[selectedNumber-1] + '️⃣'
      // if racer[] is selectedNumber, add emoji
  

      const racerText = [] as string[];

      for (let j = 0; j < racerCount; j++) {
        
        if (racer[j] === parseInt(selectedNumber)) {
          racerText.push(racer[j] + '️⃣');
        } else {
          racerText.push(racer[j] + '');
        }

      }

      const text = timer*10 - i*10 + '미터 '
        + ' ' + '🐎 ' + racerText.join(' ');

 

      //console.log("text=", text);

      /*
      const text = timer*10 - i*10 + '미터 '
        + ' ' + '🐎 ' + first
        + ' ' +  racer[1] + ' ' +  racer[2] + ' ' +  racer[3] + ' ' +  racer[4] + ' ' +  racer[5] + ' ' +  racer[6] + ' ' +  racer[7];
      */

      ///await chatResponse.delete();

      const result = await ctx.reply(text);

      //await chatResponse.editText(text);

      //await chatResponse.editCaption(text);


      /*
      await ctx.editMessageText("hi", { parse_mode: "HTML" })
      */

      // editMessageText

      //const response = await chatResponse.editText(text);
      



      //await ctx.reply("🐎 " + racer.map((r) => r).join(' '));




      // random exhcnage sequence first and second
      // and third and fourth and fifth and sixth and seventh and eighth and ninth and tenth


      const randomCount = Math.floor(Math.random() * (racerCount-1))


      for (let i = 0; i < randomCount; i++) {

        const randomIndex = Math.floor(Math.random() * (racerCount-1))

        const temp = racer[randomIndex];
        racer[randomIndex] = racer[randomIndex + 1];
        racer[randomIndex + 1] = temp;
    
      }

      


      
    }




    ctx.reply("⚖️ " + '경기결과를 확인중이니 잠시만 기다려주세요...');



    let firstHorseNumber = racer[0];

    const win = firstHorseNumber === parseInt(selectedNumber);





 

    //await ctx.reply("🐎 " + firstHorseNumber + '️⃣' + ' 번 말이 1등으로 도착하였습니다.');


    const winHorse = dataGetGame.result?.horses[Number(firstHorseNumber) - 1];


    const winHorseImageUrl = winHorse?.nft?.metadata?.image;

    if (winHorseImageUrl) {

      await ctx.replyWithPhoto(
        winHorseImageUrl,
        {
          caption: '🏆 ' + firstHorseNumber + '️⃣' + ' 번 말이 1등으로 도착하였습니다.'
        }
      )

    } else {

      await ctx.reply("🏆 " + firstHorseNumber + '️⃣' + ' 번 말이 1등으로 도착하였습니다.');

    }








    let photoUrl = '';
    let text = '';









    // horse ranking array
    // 0 => 4
    // 1 => 2
    // 2 => 7

    const horseRanking = [] as number[];

    for (let i = 0; i < racer.length; i++) {
      horseRanking.push(racer[i]);
    }

    const urlUpdateRaceGame = `${process.env.FRONTEND_APP_ORIGIN}/api/game/updateRaceGame`;
  
    const responseUpdateRaceGame = await fetch(urlUpdateRaceGame, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        sequence: selectedSequence,
        selectedNumber: selectedNumber,
        horseRanking: horseRanking,
        resultNumber: firstHorseNumber,
        win: win,
      }),
    });

    if (responseUpdateRaceGame.status !== 200) {
      return ctx.reply("🚫 Failed to update game 1");
    }

    const dataUpdateGame = await responseUpdateRaceGame.json();

    console.log("dataUpdateGame=", dataUpdateGame);



    if (dataUpdateGame.result.status === 'fail') {

      if (dataUpdateGame.result?.data.status === 'closed') {

        const sequence = dataUpdateGame.result?.data.sequence;

        // 1️⃣ 회차
        // 2️⃣ 회차
        // 12 회차 => 1️⃣ 2️⃣ 회차
        // convert number to emoji
        //const sequenceEmoji = sequence.toString().replace(/\d/g, (d: any) => String.fromCharCode(0x30 + (+d)));

        const sequenceString = sequence.toString();
        let sequenceEmoji = '';
        for (let i = 0; i < sequenceString.length; i++) {
          sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
        }

        return ctx.reply("🚫 " + sequenceEmoji + '회차 게임은 이미 종료되었습니다.');

        

      } else {

        return ctx.reply("🚫 Failed to run game");

      }

    }


    const winPrize = dataUpdateGame.result?.data.winPrize;

    console.log("winPrize=", winPrize);


    // 1️⃣ 회차
    // 2️⃣ 회차
    // 12 회차 => 1️⃣ 2️⃣ 회차
    // convert number to emoji
    //const sequenceEmoji = selectedSequence.toString().replace(/\d/g, d => String.fromCharCode(0x30 + (+d)));

    const sequenceString = selectedSequence.toString();
    let sequenceEmoji = '';
    for (let i = 0; i < sequenceString.length; i++) {
      sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
    }

    if (win) {
 
      photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/horse-racing-winner-banner.jpg`;


      text = sequenceEmoji + '회차 ' + selectedNumber + '️⃣' + ' 번 말을 선택하셨습니다.'
      + '\n\n💥 결과: ' + firstHorseNumber + '️⃣' + ' 번 말이 1등으로 도착하였습니다.'
      + '\n\n🎉 축하합니다! 당첨되셨습니다.'
      + '\n\n💲 ' + '당첨금: ' + winPrize + ' USDT가 1분내로 회원님 지갑으로 입금됩니다.'
      + '\n\n👇 아래 버튼을 눌러 경마 게임을 시작하세요';

    } else {

      photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/horse-racing-loser-banner.jpg`;

      text = sequenceEmoji + '회차 ' + selectedNumber + '️⃣' + ' 번 말을 선택하셨습니다.'
      + '\n\n💥 결과: ' + firstHorseNumber + '️⃣' + ' 번 말이 1등으로 도착하였습니다.'
      + '\n\n😭 아쉽게도 꽝입니다.'
      + '\n\n👇 아래 버튼을 눌러 경마 게임을 시작하세요';

    }

    //const keyboard = new InlineKeyboard()
    //  .text('🎲 홀', 'roulette-odd').text('🎲 짝', 'roulette-even')

    const nextSequnce = parseInt(selectedSequence) + 1;

    // 1️⃣ 회차
    // 2️⃣ 회차
    // 12 회차 => 1️⃣ 2️⃣ 회차
    // convert number to emoji
    //const nextSequenceEmoji = nextSequnce.toString().replace(/\d/g, d => String.fromCharCode(0x30 + (+d)));

    const nextSequenceString = nextSequnce.toString();
    let nextSequenceEmoji = '';
    for (let i = 0; i < nextSequenceString.length; i++) {
      nextSequenceEmoji += nextSequenceString[i] + '️⃣' + ' ';
    }

    const keyboard = new InlineKeyboard()
      .text(nextSequenceEmoji + '회차 경마 게임 시작하기', 'race')


    
    return ctx.replyWithPhoto(
      photoUrl,
      {
        caption: text,
        reply_markup: keyboard
      }
    )









  } else if (data === "roulette") {

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

    const nickname = dataGetUser.result.nickname;




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

    const status = dataSetGame?.result?.status;

    if (status === 'waiting') {

      const sequence = parseInt(dataSetGame?.result?.data?.sequence) + 1;

      const waitingTime = dataSetGame?.result?.waitingTime;


      // 1️⃣ 회차
      // 2️⃣ 회차
      // 12 회차 => 1️⃣ 2️⃣ 회차
      // convert number to emoji



      //const sequenceEmoji = sequence.toString().replace(/\d/g, (d: any) => String.fromCharCode(0x30 + (+d)));

      const sequenceString = sequence.toString();
      let sequenceEmoji = '';
      for (let i = 0; i < sequenceString.length; i++) {
        sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
      }


      const text = sequenceEmoji + '회차 홀짝 게임을 시작합니다.'
      + '\n\n⏱️ ' + waitingTime + '초 후에 게임을 시작할수 있습니다. 🙏 잠시만 기다려주세요.'
      + '\n\n👇 아래 버튼을 눌러 홀짝 게임을 시작하세요';

      //return ctx.reply(text);

      const keyboard = new InlineKeyboard()
      .text(sequenceEmoji + '회차 홀짝 게임 시작하기', 'roulette')
    
      //const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-waiting.jpg`;
      const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-waiting.webp`;

      return ctx.replyWithPhoto(
        photoUrl,
        {
          caption: text,
          reply_markup: keyboard
        }
      )
    
    }

    let sequence;

    if (status === "success") {

      sequence = dataSetGame?.result?.data?.sequence;

    //console.log("sequence=", sequence);

      if (!sequence) {
        return ctx.reply("🚫 Failed to set game");
      }

    }


    const winPrize = dataSetGame?.result?.data?.winPrize;



    const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-banner.jpg`;
    
    //const videoFile = new InputFile(`/home/ubuntu/video/welcome-casino.gif`)
    //const videoFile = new InputFile(`/home/ubuntu/video/banano-stom.mp4`)

      // 1️⃣ 회차
    // 2️⃣ 회차
    // 12 회차 => 1️⃣ 2️⃣ 회차
    // convert number to emoji
    //const sequenceEmoji = sequence.toString().replace(/\d/g, (d: any) => String.fromCharCode(0x30 + (+d)));

    const sequenceString = sequence.toString();
    let sequenceEmoji = '';
    for (let i = 0; i < sequenceString.length; i++) {
      sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
    }

    const text = sequenceEmoji + '회차 홀짝 게임을 시작합니다.'
      + '\n\n💲 당첨금: ' + winPrize + ' USDT'
      + '\n\n👇 아래 버튼에서 🚹 홀 또는 🚺 짝을 선택하세요.';

    const queryDataOdd = 'roulette-odd' + '-' + sequence;
    const queryDataEvent = 'roulette-even' + '-' + sequence;

    const keyboard = new InlineKeyboard()
      //.text('🎲 홀', 'roulette-odd').text('🎲 짝', 'roulette-even')
      .text('🚹 홀', queryDataOdd).text('🚺 짝', queryDataEvent)

    
    return ctx.replyWithPhoto(
      photoUrl,
      {
        caption: text,
        reply_markup: keyboard
      }
    )
      
    /*
    return ctx.replyWithVideo(
      videoFile,
      {
        caption: text,
        reply_markup: keyboard
      }
    )
      */



  ///} else if (data === "roulette-odd" || data === "roulette-even") {

  } else if (data.startsWith("roulette-")) {

    // roulette-odd-1
    // roulette-even-1

    // odd or even
    // 1 or 2 or 3 or 4 or 5 or 6 or 7 or 8 or 9 or 10

    const dataSplit = data.split('-');

    const selectedOddOrEven = dataSplit[1];
    const selectedSequence = dataSplit[2];





    //const randomNumber = Math.floor(Math.random() * 2);

    //const randomNumber = Math.floor(Math.random() * 20);

    // random number with seed number, seed number is time
    // random number is 0, 1, 2, .. , 19

    const seed = new Date().getTime();
    const randomNumber = Math.floor(Math.abs(Math.sin(seed)) * 20);



    //const result = randomNumber === 0 ? "🚺 짝" : "🚹 홀";

    // random number divided by 2 is 0 or 1
    // odd is 1, even is 0

    const resultOddOrEven = randomNumber / 2 === 0 ? "even" : "odd";



    console.log('selectedSequence', selectedSequence);
    console.log('selectedOddOrEven', selectedOddOrEven);
    console.log('resultOddOrEven', resultOddOrEven);





    const win = (selectedOddOrEven === "odd" && resultOddOrEven === "odd")
      || (selectedOddOrEven === "even" && resultOddOrEven === "even");


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
      return ctx.reply("🚫 Failed to get user");
    }

    const dataUser = await responseGetUser.json();
    //console.log("dataUser", dataUser);

    if (!dataUser?.result?.walletAddress) {
      return ctx.reply("🚫 Failed to get wallet address");
    }
    
    const walletAddress = dataUser.result.walletAddress;
    

    /*
    let resultOddOrEven;

    if (randomNumber === 1) resultOddOrEven = "odd"
    else if (randomNumber === 0) resultOddOrEven = "even";
    */

    const urlSetGame = `${process.env.FRONTEND_APP_ORIGIN}/api/game/updateGame`;
  
    const responseUpdateGame = await fetch(urlSetGame, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        sequence: selectedSequence,
        selectedOddOrEven: selectedOddOrEven,
        resultOddOrEven: resultOddOrEven, 
        win: win,
      }),
    });

    if (responseUpdateGame.status !== 200) {
      return ctx.reply("🚫 Failed to update game 1");
    }

    const dataUpdateGame = await responseUpdateGame.json();

    if (dataUpdateGame.result.status === 'fail') {

      if (dataUpdateGame.result?.data.status === 'closed') {

        const sequence = dataUpdateGame.result?.data.sequence;

        // 1️⃣ 회차
        // 2️⃣ 회차
        // 12 회차 => 1️⃣ 2️⃣ 회차
        // convert number to emoji
        //const sequenceEmoji = sequence.toString().replace(/\d/g, (d: any) => String.fromCharCode(0x30 + (+d)));

        const sequenceString = sequence.toString();
        let sequenceEmoji = '';
        for (let i = 0; i < sequenceString.length; i++) {
          sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
        }

        return ctx.reply("🚫 " + sequenceEmoji + '회차 게임은 이미 종료되었습니다.');

        

      } else {

        return ctx.reply("🚫 Failed to run game");

      }

    }

    //console.log("walletAddress=", walletAddress);
    //console.log("selectedSequence=", selectedSequence);
    //console.log("oddOrEven=", oddOrEven);
    //console.log("resultOddOrEven=", resultOddOrEven);
    //console.log("win=", win);

    console.log("dataUpdateGame=", dataUpdateGame);

  

    /*
    const sequence = dataUpdateGame?.result?.sequence;

    //console.log("sequence=", sequence);

    if (!sequence) {
      return ctx.reply("Failed to set game 2");
    }
      */

    
    if (selectedOddOrEven === "odd") {
      await ctx.reply("🚹 홀을 선택하셨습니다.");
    } else if (selectedOddOrEven === "even") {
      await ctx.reply("🚺 짝을 선택하셨습니다.");
    }

    // loop random number and reply count '홀', '짝'
    for (let i = 0; i < randomNumber; i++) {

      await ctx.reply("⏳ 결과를 확인중입니다..." + " " + (i % 2 === 0 ? "🚹 홀" : "🚺 짝")); 
      
    }

    if (resultOddOrEven === "odd") {
      await ctx.reply("💥 결과: 🚹 홀");
    } else {
      await ctx.reply("💥 결과: 🚺 짝");
    }



    ///await ctx.reply("⏳ " + selectedSequence + "회차 홀짝 게임 결과를 확인중입니다...");



    const resultOddOrEvenText = resultOddOrEven === "odd" ? "🚹 홀" : "🚺 짝";
    

    //const winningPrice = dataUpdateGame.result?.data.settlement;
    const winPrize = dataUpdateGame.result?.data.winPrize;


    // 1️⃣ 회차
    // 2️⃣ 회차
    // 12 회차 => 1️⃣ 2️⃣ 회차
    // convert number to emoji
    //const sequenceEmoji = selectedSequence.toString().replace(/\d/g, d => String.fromCharCode(0x30 + (+d)));

    const sequenceString = selectedSequence.toString();
    let sequenceEmoji = '';
    for (let i = 0; i < sequenceString.length; i++) {
      sequenceEmoji += sequenceString[i] + '️⃣' + ' ';
    }

    if (win) {
 
      photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-wins.jpg`;



      if (selectedOddOrEven === "odd") {
        text = sequenceEmoji + '회차 🚹 홀을 선택하셨습니다.'
          + '\n\n💥 결과: ' + resultOddOrEvenText + ' 😊 당첨!!!'
          + '\n\n💲 ' + '당첨금: ' + winPrize + ' USDT가 1분내로 회원님 지갑으로 입금됩니다.'
          + '\n\n👇 아래 버튼을 눌러 홀짝 게임을 시작하세요';
      }
      if (selectedOddOrEven === "even") {
        text = sequenceEmoji + '회차 🚺 짝을 선택하셨습니다.'
          + '\n\n💥 결과: ' + resultOddOrEvenText + ' 😊 당첨!!!'
          + '\n\n💲 ' + '당첨금: ' + winPrize + ' USDT'
          + '\n\n👇 아래 버튼을 눌러 홀짝 게임을 시작하세요';
      }

    } else {

      photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/roulette-lose.jpg`;

      if (selectedOddOrEven === "odd") {
        text = sequenceEmoji + '회차 🚹 홀을 선택하셨습니다.'
        + '\n\n💥 결과: ' + resultOddOrEvenText + ' 😭 꽝!!!'
        + '\n\n👇 아래 버튼을 눌러 홀짝 게임을 시작하세요';
      }

      if (selectedOddOrEven === "even") {
        text = sequenceEmoji + '회차 🚺 짝을 선택하셨습니다.'
        + '\n\n💥 결과: ' + resultOddOrEvenText + ' 😭 꽝!!!'
        + '\n\n👇 아래 버튼을 눌러 홀짝 게임을 시작하세요';
      }

    }

    //const keyboard = new InlineKeyboard()
    //  .text('🎲 홀', 'roulette-odd').text('🎲 짝', 'roulette-even')

    const nextSequnce = parseInt(selectedSequence) + 1;

    // 1️⃣ 회차
    // 2️⃣ 회차
    // 12 회차 => 1️⃣ 2️⃣ 회차
    // convert number to emoji
    //const nextSequenceEmoji = nextSequnce.toString().replace(/\d/g, d => String.fromCharCode(0x30 + (+d)));

    const nextSequenceString = nextSequnce.toString();
    let nextSequenceEmoji = '';
    for (let i = 0; i < nextSequenceString.length; i++) {
      nextSequenceEmoji += nextSequenceString[i] + '️⃣' + ' ';
    }

    const keyboard = new InlineKeyboard()
      .text(nextSequenceEmoji + '회차 홀짝 게임 시작하기', 'roulette')


    
    return ctx.replyWithPhoto(
      photoUrl,
      {
        caption: text,
        reply_markup: keyboard
      }
    )
    

    //const url = 'https://naver.com';

    //return ctx.answerCallbackQuery({ url });


    
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
      + '\n\n' + '💲 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 USDT 판매/구매 하세요.';

      // english
      //+ '\n\n' + '✅ Wallet Address: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      //+ '\n\n' + '✅ Wallet Balance: ' + balance + ' USDT\n\n' + '👇 Press the button below to sell/buy USDT.';

      const urlSellUsdt = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/kr/sell-usdt-simple`;
      const urlBuyUsdt = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/kr/buy-usdt`;


      const keyboard = new InlineKeyboard()
        .webApp('💰 USDT 판매', urlSellUsdt)
        .webApp('💰 USDT 구매', urlBuyUsdt)



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
      + '\n\n' + '💲 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 게임으로 이동하세요.';
      // english
      //+ '\n\n' + '✅ Wallet Address: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      //+ '\n\n' + '✅ Wallet Balance: ' + balance + ' USDT\n\n' + '👇 Press the button below to go to the game.';

      const keyboard = new InlineKeyboard()
        //.webApp('💰 게임하러가기', urlGame)
        // english
        //.webApp('💰 Go to the game', urlGame)

        .webApp('🎮 탭투언 게임', urlGame)
        .webApp('🐎 그랑더비 게임', urlGameGranderby)
        .row()
        .text('🎲 홀짝 게임', 'roulette')
        .text('🐎 경마 게임', 'race')

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
      + '\n\n' + '💲 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 나의 지갑으로 이동하세요.';
      // english
      //+ '\n\n' + '✅ Wallet Address: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      //+ '\n\n' + '✅ Wallet Balance: ' + balance + ' USDT\n\n' + '👇 Press the button below to go to my wallet.'
  
      const keyboard = new InlineKeyboard()
        .webApp('💰 나의 코인 자산', urlMyWallet)
        .webApp('💰 나의 NFT 자산', urlMyNft)
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




feature.command('okx', async (ctx) => {

  console.log('okx command');

  ctx.reply('⏳ ' + "OKX를 시작합니다. 잠시만 기다려주세요...");


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

      const videoFile = new InputFile(`/home/ubuntu/video/logo-centerbot.gif`)


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
    //.row()
    .webApp('🚻 나의 프로필 보러가기', urlMyProfile)
    .row()
    //.webApp('🤖 나의 에이전트봇', urlReferral)
    .webApp('🤖 나의 마스터봇', urlTbot)
    //.row()
    .webApp('📆 나의 보상내역 보러가기', urlClaim)


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






feature.command('start', async (ctx) => {

  console.log('start command');


  ctx.reply('⏳ ' + "NOAH SKY를 시작합니다. 잠시만 기다려주세요...");



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



    if (data.result && data.result.center !== center) {

      // 당신을 봇을 사용할 수 없습니다.
      // link to the center

      const videoFile = new InputFile(`/home/ubuntu/video/logo-centerbot.gif`)


      // 소속 센터봇 변경하기
      const keyboard = new InlineKeyboard()
        .text('🚻 소속 센터봇 변경하기', 'centerbot-' + center);
      
      return ctx.replyWithVideo(
        videoFile,
        {
          caption: "🚫 당신은 이 봇을 사용할 수 없습니다.\n\n" + "소속 센터봇: " + data.result.center,
          // english
          //caption: "🚫 You cannot use this bot.\n\n" + "Center Bot: " + data.result.center,
          reply_markup: keyboard
        },
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



  //const urlClaim = `${process.env.FRONTEND_APP_ORIGIN}/claim?walletAddress=${walletAddress}`;
  const urlClaim = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/my-wallet-noahs`;



  let keyboard = null;
  
  if (referralCode || isCenterOwner) {
    keyboard = new InlineKeyboard()
    .webApp('🚻 나의 프로필 보러가기', urlMyProfile)
    .row()
    .webApp('💰 나의 NOAH 채굴 NFT 보러가기', urlNft)
    .row()
    .webApp('🎟️ 나의 NOAH 채굴 NFT 구매신청하기', urlNftBuy)
    .row()
    .webApp('📆 나의 채굴 보상내역 보러가기', urlClaim)
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



  const title = '©️ ' + 'NOAH SKY에 오신것을 환영합니다.'
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











// show game
feature.command('affiliation', async (ctx) => {
  
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






      const urlAffiliation = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}&center=${center}&path=/affiliation`;


      const text = '\n\n✅ 지갑주소: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      + '\n\n' + '💲 지갑잔고: ' + balance + ' USDT\n\n' + '👇 아래 버튼을 눌러 추천코드 관리로 이동하세요.';
      // english
      //+ '\n\n' + '✅ Wallet Address: ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-6)
      //+ '\n\n' + '✅ Wallet Balance: ' + balance + ' USDT\n\n' + '👇 Press the button below to go to the game.';

      const keyboard = new InlineKeyboard()
        //.webApp('💰 게임하러가기', urlGame)
        // english
        //.webApp('💰 Go to the game', urlGame)

        .webApp('♻️ 나의 추천코드 관리하기 ♻️', urlAffiliation)


      const photoUrl = `${process.env.FRONTEND_APP_ORIGIN}/banner-affiliate.webp`;


      
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

  console.log("ctx", ctx);

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
