import { NextResponse, type NextRequest } from "next/server";

import {
	deleteMessage
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { _id } = body;


  //console.log("walletAddress", walletAddress);


  const result = await deleteMessage({
    _id: _id,
    limit: 500,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
