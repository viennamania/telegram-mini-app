import { NextResponse, type NextRequest } from "next/server";

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



// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";


export async function POST(request: NextRequest) {

  const body = await request.json();
  /*
            orderId: orderId,
          tradeId: tradeId,
          amount: amount
  */

  const { orderId, transactionHash } = body;

  console.log("orderId", orderId);

  const sellOrder = await getOneSellOrderForEscrow({
    orderId: orderId,
  });

  if (!sellOrder) {
    return NextResponse.json({
      result: null,
      error: "Sell order not found",
    });
  }



  const result = await requestPayment({
    orderId: orderId,
    transactionHash: transactionHash,
  });




  
  const bankName = sellOrder.seller.bankInfo.bankName;
  const accountNumber = sellOrder.seller.bankInfo.accountNumber;
  const accountHolder = sellOrder.seller.bankInfo.accountHolder;
  ///const depositName = sellOrder.tradeId;
  const krwAmount = sellOrder.krwAmount;



  const buyerWalletAddress = sellOrder.buyer.walletAddress;

  const user = await getOneByWalletAddress(buyerWalletAddress);


  if (user) {

    const center = user.center;
    
    if (buyerWalletAddress) {

      const messagetext = `입금액: ${krwAmount}원\n은행명: ${bankName}\n계좌번호: ${accountNumber}\n예금주: ${accountHolder}`;

      const result = await insertOtcMessageByWalletAddress({
        center: center,
        walletAddress: buyerWalletAddress,
        sellOrder: sellOrder,
        message: messagetext,
      } );

      console.log("insertOtcMessageByWalletAddress result", JSON.stringify(result));


    }

  }


 
  return NextResponse.json({

    result,
    
  });
  
}
