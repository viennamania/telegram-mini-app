import { NextResponse, type NextRequest } from "next/server";

import {
  getRewardsByWalletAddress,
} from '@lib/api/referral';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;



  const result = await getRewardsByWalletAddress(walletAddress);

 
  return NextResponse.json({

    result,
    
  });
  
}
