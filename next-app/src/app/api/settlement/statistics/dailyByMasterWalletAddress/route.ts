import { NextResponse, type NextRequest } from "next/server";


export async function POST(request: NextRequest) {

    const body = await request.json();

    const { masterWalletAddress } = body;


    if (!masterWalletAddress) {

        return NextResponse.error();
    }

    const response = await fetch("https://owinwallet.com/api/settlement/statistics/dailyByMasterWalletAddress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        masterWalletAddress,
      }),
    });
  
    if (!response.ok) {
      return NextResponse.error();
    }
  
    const jsonObj = await response.json();
  
    ///console.log("getReferApplications jsonObj: ", jsonObj);



    
    return NextResponse.json({
  
      result: jsonObj,
      
    });
  
  
}
