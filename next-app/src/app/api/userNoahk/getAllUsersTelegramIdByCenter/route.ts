import { NextResponse, type NextRequest } from "next/server";

import {
	getAllUsersTelegramIdByCenter,
} from '@lib/api/userNoahk';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    center,
    searchNickname,
  } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getAllUsersTelegramIdByCenter({
    limit: 100,
    page: 0,
    center,
    searchNickname,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
