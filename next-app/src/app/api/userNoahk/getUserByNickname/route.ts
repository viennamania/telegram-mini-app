import { NextResponse, type NextRequest } from "next/server";

import {
	getOneByNickname,
} from '@lib/api/userNoahk';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { nickname } = body;



  const result = await getOneByNickname(nickname);


 
 
  return NextResponse.json({

    result,
    
  });
  
}
