import { NextResponse, type NextRequest } from "next/server";

import {
	getAllMessages
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { center } = body;

  const result = await getAllMessages({
    center,
    limit: 1,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
