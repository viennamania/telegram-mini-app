import { NextResponse, type NextRequest } from "next/server";

import {
	getAllCenters,
} from '@lib/api/user';
import { get } from "http";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const result = await getAllCenters({
    limit: 100,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
