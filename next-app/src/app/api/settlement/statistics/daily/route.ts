import { NextResponse, type NextRequest } from "next/server";


export async function POST(request: NextRequest) {

    const body = await request.json();

    const { center } = body;


    if (!center) {

        return NextResponse.error();
    }

    const response = await fetch("https://owinwallet.com/api/settlement/statistics/daily", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        center,
      }),
    });
  
    if (!response.ok) {
      return NextResponse.error();
    }
  
    const jsonObj = await response.json();
  
    ////console.log("getReferApplications jsonObj: ", jsonObj);
  
    
    return NextResponse.json({
  
      result: jsonObj?.result,
      
    });
  
}
