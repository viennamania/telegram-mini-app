import { NextResponse, type NextRequest } from "next/server";

import {
	getOnePollBySequence,
} from '@lib/api/poll';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { sequence } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await getOnePollBySequence(
    sequence,
  );


 
  return NextResponse.json({

    result,
    
  });
  
}
