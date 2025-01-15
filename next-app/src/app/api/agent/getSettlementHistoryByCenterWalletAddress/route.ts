import { error } from "console";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {

  const body = await request.json();

  const { limit, page, walletAddress } = body;

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


  //console.log("getSettlementHistoryByAgentWalletAddress walletAddress: ", walletAddress);
  //console.log("getSettlementHistoryByAgentWalletAddress limit: ", limit);
  //console.log("getSettlementHistoryByAgentWalletAddress page: ", page);




  try {

    const response = await fetch("https://owinwallet.com/api/agent/getSettlementHistoryByCenterWalletAddress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit,
        page,
        walletAddress,
      }),
    });

    //console.log("getApplicationsCenter response: ", response);


    if (!response.ok) {
      return NextResponse.json({
        error: "Internal server error",
      },
      {
        status: 500,
      });
    }

    const jsonObj = await response.json();

    //console.log("getSettlementHistoryByAgentWalletAddress jsonObj: ", jsonObj);

    
    return NextResponse.json({

      settlements: jsonObj.settlements,
      
    });


  } catch (error) {
    console.error("getSettlementHistoryByAgentWalletAddress error: ", error);
    return NextResponse.json({
      error: "Internal server error",
    },
    {
      status: 500,
    });

  }



  
}
