import { NextResponse, type NextRequest } from "next/server";

import {
	getBuyOrdersByWalletAddress ,
} from '@lib/api/orderNft';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { limit, page, walletAddress } = body;



  const result = await getBuyOrdersByWalletAddress({
    limit: limit || 100,
    page: page || 0,
    walletAddress,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
