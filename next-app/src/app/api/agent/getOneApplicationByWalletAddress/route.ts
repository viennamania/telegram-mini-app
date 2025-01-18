import { NextResponse, type NextRequest } from "next/server";



import {
	getOneByWalletAddress,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;


  
  if (!walletAddress) {

    return NextResponse.error();
  }
  

  const result = await getOneByWalletAddress(walletAddress);

  
  return NextResponse.json({

    result,
    
  });


  
}
