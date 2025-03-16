import { NextResponse, type NextRequest } from "next/server";

import {
	getOneRecentPoll,
} from '@lib/api/poll';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await getOneRecentPoll(
    walletAddress,
  );


 
  return NextResponse.json({

    result,
    
  });
  
}
