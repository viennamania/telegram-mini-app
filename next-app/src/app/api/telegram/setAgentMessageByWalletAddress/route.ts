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
    agentBotNft,
    walletAddress,
    message,
  } = body;




  const result = await insertAgentMessageByWalletAddress({
    center,
    contract,
    tokenId,
    agentBotNft,
    walletAddress,
    message,
  } );

 
  return NextResponse.json({

    result,
    
  });
  
}
