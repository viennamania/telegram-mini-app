import { NextResponse, type NextRequest } from "next/server";

import {
	getAllUsersTelegramIdByCenter,
} from '@lib/api/user';
import { get } from "http";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { limit, page, center, searchNickname } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getAllUsersTelegramIdByCenter({
    limit: limit || 1000,
    page: page || 0,
    center: center || "",
    searchNickname: searchNickname || "",
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
