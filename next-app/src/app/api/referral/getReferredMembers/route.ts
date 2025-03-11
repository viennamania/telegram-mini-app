import { NextResponse, type NextRequest } from "next/server";

import {
  getReferredMembers,
} from '@lib/api/referral';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { referralCode } = body;

  console.log('referralCode', referralCode);



  const result = await getReferredMembers(referralCode);

 
  return NextResponse.json({

    result,
    
  });
  
}
