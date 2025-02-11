import { NextResponse, type NextRequest } from "next/server";

import {
	getBuyOrders,
} from '@lib/api/orderNft';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, searchMyOrders } = body;



  const result = await getBuyOrders({
    limit: 300,
    page: 0,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
