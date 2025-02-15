import { NextResponse, type NextRequest } from "next/server";

import {
	getAllMessagesByCenter,
  deleteAllMessagesByCenter,
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { center } = body;

  const result = await getAllMessagesByCenter( center );

  // delete all messages by center
  const deleteResult = await deleteAllMessagesByCenter( center );

  if (!result || !deleteResult) {
    return NextResponse.error();
  }

 
  return NextResponse.json({

    result,
    
  });
  
}
