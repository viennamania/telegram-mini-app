import { error } from "console";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, center } = body;

  //console.log("getApplicationsCenter walletAddress: ", walletAddress);
  //console.log("getApplicationsCenter center: ", center);


  if (!walletAddress) {

    return NextResponse.json({
      error: "Wallet address is required",
    },
    {
      status: 400,
    });
  }

  if (!center) {
    return NextResponse.json({
      error: "Center is required",
    },
    {
      status: 400,
    });
  }

  try {

    const response = await fetch("https://owinwallet.com/api/agent/getApplicationsForCenter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
        center,
      }),
    });

    /// console.log("getApplicationsCenter response: ", response);


    if (!response.ok) {
      return NextResponse.json({
        error: "Internal server error",
      },
      {
        status: 500,
      });
    }

    const jsonObj = await response.json();

    ///console.log("getApplicationsCenter jsonObj: ", jsonObj);

    
    return NextResponse.json({

      result: jsonObj?.result,
      resultSummary: jsonObj?.resultSummary,
      
    });


  } catch (error) {
    console.error("getApplicationsCenter error: ", error);
    return NextResponse.json({
      error: "Internal server error",
    },
    {
      status: 500,
    });

  }



  
}
