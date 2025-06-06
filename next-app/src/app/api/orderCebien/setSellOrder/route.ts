import { NextResponse, type NextRequest } from "next/server";

import {
	insertSellOrder,
} from '@lib/api/orderCebien';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, sellAmount, krwAmount, rate, privateSale } = body;

  console.log("walletAddress", walletAddress);
  

  const result = await insertSellOrder({
    walletAddress: walletAddress,
    sellAmount: sellAmount,
    krwAmount: krwAmount,
    rate: rate,
    privateSale: privateSale,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
