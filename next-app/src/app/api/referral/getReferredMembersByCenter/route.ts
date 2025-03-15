import { NextResponse, type NextRequest } from "next/server";

import {
  getReferredMembersByCenter
} from '@lib/api/referral';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { referralCode, center } = body;

  console.log('referralCode', referralCode);
  console.log('center', center);



  const result = await getReferredMembersByCenter(referralCode, center);

 
  return NextResponse.json({

    result,
    
  });
  
}
