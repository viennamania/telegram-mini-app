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
} from '@lib/api/telegram';



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


  //console.log("result", JSON.stringify(result));

  const {
    mobile: mobile,
    seller: seller,
    buyer: buyer,
    tradeId: tradeId,
    krwAmount: krwAmount,
  } = result as UserProps;

  
  const bankName = seller.bankInfo.bankName;
  const accountNumber = seller.bankInfo.accountNumber;
  const accountHolder = seller.bankInfo.accountHolder;
  const depositName = tradeId;
  const amount = krwAmount;



  const buyerWalletAddress = sellOrder.buyer.walletAddress;

  const user = await getOneByWalletAddress(buyerWalletAddress);

  if (user) {

    const center = user.center;
    
    if (buyerWalletAddress) {

      const messagetext = `입금액: ${amount}원\n은행명: ${bankName}\n계좌번호: ${accountNumber}\n예금주: ${accountHolder}\n입금자명: ${depositName}`;

      const result = await insertOtcMessageByWalletAddress({
        center,
        walletAddress: buyerWalletAddress,
        sellOrder: sellOrder,
        message: messagetext,
      } );


    }

  }

 
  return NextResponse.json({

    result,
    
  });
  
}
