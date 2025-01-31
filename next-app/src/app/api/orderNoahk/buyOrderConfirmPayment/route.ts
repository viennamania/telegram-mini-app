import { NextResponse, type NextRequest } from "next/server";



export async function POST(request: NextRequest) {

  const body = await request.json();


  return NextResponse.json({
    result: null,
  });
}