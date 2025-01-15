import { NextResponse, type NextRequest } from "next/server";

import {
	insertMessage
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    center,
    telegramId,
    message,
  } = body;




  const result = await insertMessage({
    center,
    category: "settlement",
    telegramId,
    message,
  } );

 
  return NextResponse.json({

    result,
    
  });
  
}
