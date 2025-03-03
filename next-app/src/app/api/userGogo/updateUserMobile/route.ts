import { NextResponse, type NextRequest } from "next/server";

import {
  updateUserMobile,
} from '@lib/api/userGogo';



export async function POST(request: NextRequest) {

  const body = await request.json();


  const {
    walletAddress,
    mobile,
  } = body;

  console.log("walletAddress", walletAddress);
  console.log("mobile", mobile);

  const result = await updateUserMobile({
    walletAddress: walletAddress,
    mobile: mobile,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
