import { NextResponse, type NextRequest } from "next/server";

import {
  fetchAllMessagesByCenter,
} from '@lib/api/telegram';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { center } = body;

  const result = await fetchAllMessagesByCenter( center );



  return NextResponse.json({

    result,
    
  });
  
}
