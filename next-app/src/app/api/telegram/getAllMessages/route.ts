import { NextResponse, type NextRequest } from "next/server";

import {
	getAllMessages
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const result = await getAllMessages({
    limit: 500,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
