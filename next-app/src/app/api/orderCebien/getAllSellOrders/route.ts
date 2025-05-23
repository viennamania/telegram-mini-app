import { NextResponse, type NextRequest } from "next/server";

import {
	getSellOrders,
} from '@lib/api/orderCebien';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, searchMyOrders } = body;



  const result = await getSellOrders({
    limit: 300,
    page: 0,
    walletAddress,
    searchMyOrders,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
