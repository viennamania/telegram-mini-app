import { NextResponse, type NextRequest } from "next/server";

import {
  insertOne,
} from '@lib/api/referral';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { telegramId, center, referralCode } = body;



  const result = await insertOne({
    telegramId,
    center,
    referralCode,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
