import { NextResponse, type NextRequest } from "next/server";

import {
	getTransferByWalletAddress
} from '@lib/api/transfer';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { limit, page, walletAddress } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getTransferByWalletAddress({
    limit : limit ? limit : 10,
    page  : page ? page : 0,
    walletAddress : walletAddress
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
