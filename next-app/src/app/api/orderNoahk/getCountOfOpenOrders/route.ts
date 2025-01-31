import { NextResponse, type NextRequest } from "next/server";

import {
	getOpenOrdersCount,
} from '@lib/api/orderNoahk';



export async function POST(request: NextRequest) {

  const body = await request.json();



  const result = await getOpenOrdersCount();

 
  return NextResponse.json({

    result,
    
  });
  
}
