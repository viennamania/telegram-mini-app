import { NextResponse, type NextRequest } from "next/server";

import {
	acceptBuyOrder,
} from '@lib/api/orderNft';

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";
import { idCounter } from "thirdweb/extensions/farcaster/idRegistry";


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, tradeId, seller } = body;

  console.log("tradeId", tradeId);
  console.log("seller", seller);
  

  const result = await acceptBuyOrder({
    lang: lang,
    chain: chain,
    tradeId: tradeId,
    seller: seller,

  });

  ///console.log("result", result);

 
  return NextResponse.json({

    result,
    
  });
  
}
