import { NextResponse, type NextRequest } from "next/server";

import {
	insertMessageByWalletAddress
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    center,
    walletAddress,
    message,
  } = body;




  const result = await insertMessageByWalletAddress({
    center,
    category: "settlement",
    walletAddress,
    message,
  } );

 
  return NextResponse.json({

    result,
    
  });
  
}
