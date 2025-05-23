import { NextResponse, type NextRequest } from "next/server";

import {
	getSellOrdersForBuyer,
} from '@lib/api/orderNoahk';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, searchMyTrades } = body;



  const result = await getSellOrdersForBuyer({
    limit: 300,
    page: 0,
    walletAddress,
    searchMyTrades,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
