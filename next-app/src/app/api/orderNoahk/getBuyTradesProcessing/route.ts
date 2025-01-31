import { NextResponse, type NextRequest } from "next/server";

import {
	getTradesByWalletAddressProcessing,
} from '@lib/api/orderNoahk';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;

  console.log("walletAddress", walletAddress);
  

  const result = await getTradesByWalletAddressProcessing({
    walletAddress: walletAddress,
    limit: 10,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
