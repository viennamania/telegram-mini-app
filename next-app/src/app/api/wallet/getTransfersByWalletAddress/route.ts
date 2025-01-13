import { NextResponse, type NextRequest } from "next/server";

import {
	getTransferByWalletAddress
} from '@lib/api/transfer';
import { get } from "http";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getTransferByWalletAddress({
    walletAddress,
    limit: 500,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
