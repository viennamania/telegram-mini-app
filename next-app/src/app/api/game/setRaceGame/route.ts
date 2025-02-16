import { NextResponse, type NextRequest } from "next/server";

import {
	insertOneRaceGame,
} from '@lib/api/game';




import {
  createThirdwebClient,
  getContract,
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";


import {
getNFT,

balanceOf,

totalSupply,

} from "thirdweb/extensions/erc721";







export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;

  //console.log("walletAddress", walletAddress);


  // place 8 horses
  const contractAddress = "0x41FBA0bd9f4DC9a968a10aEBb792af6A09969F60";
  // tokenId 0 to 9999
  // select 8 horses from 0 to 9999

  // 1. get 8 random numbers from 0 to 9999
  // 2. place 8 horses with the random numbers
  // non duplicate random numbers



  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  if (!client) {
    return NextResponse.json({
      result: null,
    });
  }


    const contractErc721 = getContract(
      {
        client: client,
        chain: polygon,
        address: contractAddress,
      }
    );


  const horses = [];
  const randomNumbers = [] as number[];
  while (randomNumbers.length < 8) {
    const randomNumber = Math.floor(Math.random() * 10000);
    if (!randomNumbers.includes(randomNumber)) {

      randomNumbers.push(randomNumber);


      // getnft contractAddress and tokenId

      const nft = await getNFT({
        contract: contractErc721,
        tokenId: BigInt(randomNumber),
      });

      horses.push({
        tokenId: randomNumber,
        nft: nft,
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
