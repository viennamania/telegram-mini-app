import { NextResponse, type NextRequest } from "next/server";

import {
	getMessagesByTelegramId
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { telemgramId } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getMessagesByTelegramId({
    telemgramId,
    limit: 500,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
