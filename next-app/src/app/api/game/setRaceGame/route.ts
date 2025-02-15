import { NextResponse, type NextRequest } from "next/server";

import {
	insertOneRaceGame,
} from '@lib/api/game';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await insertOneRaceGame({
    walletAddress: walletAddress,
    usdtAmount: 0,
    krwAmount: 0,
    rate: 0,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
