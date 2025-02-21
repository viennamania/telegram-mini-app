import { NextResponse, type NextRequest } from "next/server";

import {
  getOneByTelegramId,
} from '@lib/api/referral';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { telegramId, center } = body;



  const result = await getOneByTelegramId(telegramId, center);

 
  return NextResponse.json({

    result,
    
  });
  
}
