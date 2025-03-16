import { NextResponse, type NextRequest } from "next/server";


import {
	updateUserOne,
} from '@lib/api/poll';



import { ethers } from "ethers";

import {
  createThirdwebClient,

} from "thirdweb";

//import { polygonAmoy } from "thirdweb/chains";
import {
  polygon,
  arbitrum,
 } from "thirdweb/chains";

import {
  privateKeyToAccount,
  smartWallet,
  getWalletBalance,
  
 } from "thirdweb/wallets";
import { wallet } from "@/app/constants";




export async function GET(request: NextRequest) {

  const sequence = request.nextUrl.searchParams.get('sequence') || "";

  if (!sequence) {
    return NextResponse.json({
      result: "error",
    });
  }


  const walletAddress = ethers.Wallet.createRandom().address;

  const user = {
    walletAddress: walletAddress,
  };

  let selectedOddOrEven = "";

  // random number
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  if (randomNumber % 2 == 0) {
    selectedOddOrEven = "even";
  } else {
    selectedOddOrEven = "odd";
  }



  const result = await updateUserOne({
    sequence: parseInt(sequence),
    user: user,
    selectedOddOrEven: selectedOddOrEven,
  });



  //const walletAddress = request.nextUrl.searchParams.get('walletAddress') || "";



  /*
    if (userSeller) {
      
      const center = userSeller.center;
      
      if (sellerWalletAddress) {

        const messagetext = '구매자가 구매를 신청하였습니다.'
        + '\n\n겨래번호: ' + '#' + acceptedSellOrder.tradeId
        + '\n\n구매자 입금자명: ' + depositName

        const result = await insertOtcMessageByWalletAddress({
          center: center,
          walletAddress: sellerWalletAddress,
          //sellOrder: sellOrder,
          sellOrder: acceptedSellOrder,
          message: messagetext,
        } );

        //console.log("insertOtcMessageByWalletAddress result", JSON.stringify(result));

      }

    }

  */

  



 
  return NextResponse.json({

    result: "success",
  });





}
