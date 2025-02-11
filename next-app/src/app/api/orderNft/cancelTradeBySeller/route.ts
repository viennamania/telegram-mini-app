import { NextResponse, type NextRequest } from "next/server";

import {
	cancelTradeBySeller,
} from '@lib/api/orderNft';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { tradeId,} = body;

  //console.log("orderId", orderId);
  //console.log("walletAddress", walletAddress);
  

  const result = await cancelTradeBySeller({
    tradeId: tradeId,
  });

  ////console.log("result", result);


  if (result) {


    return NextResponse.json({

      result: true,
      
    });  
  } else {
 
    return NextResponse.json({

      result: false,
      
    });

  }
  
}
