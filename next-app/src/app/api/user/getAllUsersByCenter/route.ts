import { NextResponse, type NextRequest } from "next/server";

import {
	getAllUsersTelegramIdByCenter,
} from '@lib/api/user';
import { get } from "http";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { center } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getAllUsersTelegramIdByCenter({
    limit: 100,
    page: 1,
    center,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
