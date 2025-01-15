import { NextResponse, type NextRequest } from "next/server";

import {
	insertAgentMessageByWalletAddress
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    center,
    contract,
    tokenId,
    walletAddress,
    message,
  } = body;




  const result = await insertAgentMessageByWalletAddress({
    center,
    contract,
    tokenId,
    walletAddress,
    message,
  } );

 
  return NextResponse.json({

    result,
    
  });
  
}
