import { NextResponse, type NextRequest } from "next/server";

import {
	insertOneRaceGame,
} from '@lib/api/game';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;

  //console.log("walletAddress", walletAddress);


  // place 8 horses
  // contractAddress = 0x41FBA0bd9f4DC9a968a10aEBb792af6A09969F60
  // tokenId 0 to 9999
  // select 8 horses from 0 to 9999

  // 1. get 8 random numbers from 0 to 9999
  // 2. place 8 horses with the random numbers
  // non duplicate random numbers

  const horses = [];
  const randomNumbers = [] as number[];
  while (randomNumbers.length < 8) {
    const randomNumber = Math.floor(Math.random() * 10000);
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
      horses.push({
        tokenId: randomNumber,
      });
    }
  }




  

  const result = await insertOneRaceGame({
    walletAddress: walletAddress,
    horses: horses,
    usdtAmount: 0,
    krwAmount: 0,
    rate: 0,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
