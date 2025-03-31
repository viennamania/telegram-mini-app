import { NextResponse, type NextRequest } from "next/server";

import {
	insertOneRaceGame,
} from '@lib/api/gameCebien';




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

ownerOf,

///getTotalClaimedSupply,

} from "thirdweb/extensions/erc721";


import {
  getOneByWalletAddress,
} from '@lib/api/user';

import {
  insertMessage
} from '@lib/api/telegram';

/*
export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;

*/
// test

export async function GET(request: NextRequest) {

  const walletAddress = "0x542197103Ca1398db86026Be0a85bc8DcE83e440"

  console.log("walletAddress", walletAddress);


  const center = "ppump_songpa_bot";

  //console.log("walletAddress", walletAddress);


  // place 8 horses
  //const contractAddress = "0x41FBA0bd9f4DC9a968a10aEBb792af6A09969F60";
  // tokenId 0 to 9999
  // select 8 horses from 0 to 9999

  // 1. get 8 random numbers from 0 to 9999
  // 2. place 8 horses with the random numbers
  // non duplicate random numbers

  const contractAddress = "0xb3f4f5396075c4141148B02D43bF54C5Da6525dD";
  //const totalSupply = 10; // total supply of the contract
  // tokenId 0 to 9
  // select 8 horses from 0 to 9


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


  // get total supply of the contract
  /*
  const contractTotalSupply = await totalSupply({
    contract: contractErc721,
  });

  const totalSupplyNumber = Number(contractTotalSupply);
  console.log("totalSupplyNumber=======>", totalSupplyNumber);
  */




    /*
    const totalClaimedSupply = await getTotalClaimedSupply({
      contract: contractErc721,
    });
    

    // totalClaimedSupply is bigint
    // convert to number

    const totalClaimedSupplyNumber = Number(totalClaimedSupply.toString());
    console.log("totalClaimedSupplyNumber=======>", totalClaimedSupplyNumber);
    */

    const resultTotalSupply = await totalSupply({
      contract: contractErc721,
    });

    const totalSupplyNumber = Number(resultTotalSupply.toString());
    console.log("totalSupplyNumber=======>", totalSupplyNumber);


  //const totalSupply = totalClaimedSupplyNumber; // total supply of the contract
  


  //const totalSupply = 30; // total supply of the contract

  const horses = [];
  const randomNumbers = [] as number[];
  while (randomNumbers.length < 8) {
    
    const randomNumber = Math.floor(Math.random() * totalSupplyNumber);

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

  if (result) {

    horses.map(async (horse) => {
      const tokenId = horse.tokenId;
      
      const owner = await ownerOf({
        contract: contractErc721,
        tokenId: BigInt(tokenId),
      });
      const ownerAddress = owner.toString();
      console.log("ownerAddress=======>", ownerAddress);
  
      if (ownerAddress != walletAddress) {
        
        // send message to telegram bot
  
        const user = await getOneByWalletAddress(ownerAddress);
        const telegramId = user?.telegramId;
  
        console.log("telegramId=======>", telegramId);
  
        const message = `당신의 말(#${tokenId})이 경주에 출전하였습니다.`;
  
        if (telegramId) {
  
          await insertMessage({
            center,
            category: "racegame",
            telegramId,
            message,
          } );
  
        }
  
      }
  
  
    });

  }


 
  return NextResponse.json({

    result,
    
  });
  
}
