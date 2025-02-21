import { NextResponse, type NextRequest } from "next/server";

import {
  insertOne,
} from '@lib/api/referral';

import {
  getOneByWalletAddress,
} from '@lib/api/user';

import {
  insertMessage,
} from '@lib/api/telegram';

import { Network, Alchemy } from 'alchemy-sdk';


const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { telegramId, center, referralCode } = body;



  const result = await insertOne({
    telegramId,
    center,
    referralCode,
  });

  if (result) {


    const user = await getOneByWalletAddress(telegramId);

    const userNickname = user?.nickname;


    // telegram message

    // get contractAddress, tokenId from referralCode

    const nftContractAddress = referralCode.split("-")[0];
    const tokenId = referralCode.split("-")[1];

    // get owiner form contractAddress, tokenId


    // Get owner of NFT
    const owner = await alchemy.nft.getOwnersForNft(
      nftContractAddress,
      tokenId
    );

    ///console.log("owner: ", owner);


    /*
    {
      owners: [ '0xAcDb8a6c00718597106F8cDa389Aac68973558B3' ],
      pageKey: null
    }
    */

    const ownerWalletAddress = owner.owners[0];

    // get telegramId from ownerWalletAddress

    const referralUser = await getOneByWalletAddress(ownerWalletAddress);

    if (referralUser) {
      const ownerTelegramId = referralUser.telegramId;
      const ownerNickname = referralUser.nickname;

      // send telegram message

      const message = `🎉 축하합니다! ${userNickname}님이 ${ownerNickname}님의 추천코드를 사용하셨습니다.`;

      await insertMessage({
        center,
        category: 'referral',
        telegramId: ownerTelegramId,
        message,
      });

    }


  }

 
  return NextResponse.json({

    result,
    
  });
  
}
