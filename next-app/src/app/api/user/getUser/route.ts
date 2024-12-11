import { NextResponse, type NextRequest } from "next/server";

/*
import {
	getOneByWalletAddress,
} from '@lib/api/user';
*/


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, center } = body;


  console.log("walletAddress", walletAddress);


  ///const result = await getOneByWalletAddress(walletAddress);


  let apiURL = "https://owinwallet.com/api/user/getUser";

  if (
    center === "ppump_orry_bot"
    || center === "ppump_koko_bot"
    || center === "ppump_joajoa_bot"
    || center === "ppump_bigrich_bot"
  ) {
    apiURL = "https://ppump.me/api/user/getUser";
  }


  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: walletAddress,
    }),
  });
  

  if (!response.ok) {
    return NextResponse.error();
  }

  const jsonObj = await response.json();

  const result = jsonObj?.result;

 
  return NextResponse.json({

    result,
    
  });

  
}
