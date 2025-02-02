import { NextResponse, type NextRequest } from "next/server";

import {
	insertSellOrder,
} from '@lib/api/orderNoahk';


import {
  UserProps,
	requestPayment,
  getOneSellOrderForEscrow,
} from '@lib/api/orderNoahk';

import {
  getOneByWalletAddress,
} from '@lib/api/userNoahk';

import {
	insertOtcMessageByWalletAddress
} from '@lib/api/telegramNoahk';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress, sellAmount, krwAmount, rate, privateSale
  } = body;

  console.log("walletAddress", walletAddress);
  

  const result = await insertSellOrder({
    walletAddress: walletAddress,
    sellAmount: sellAmount,
    krwAmount: krwAmount,
    rate: rate,
    privateSale: privateSale,
  });


  // send message to seller telegram
  /*

  const user = await getOneByWalletAddress(walletAddress);

  if (user) {

    await insertOtcMessageByWalletAddress({
      center: user.center,
      walletAddress: walletAddress,
      sellOrder: result,
      message: '판매 요청이 등록되었습니다.',
    });

  }
  */



 
  return NextResponse.json({

    result,
    
  });
  
}
