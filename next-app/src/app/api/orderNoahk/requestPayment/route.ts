import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
	requestPayment,
} from '@lib/api/orderNoahk';

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




 
  return NextResponse.json({

    result,
    
  });
  
}
