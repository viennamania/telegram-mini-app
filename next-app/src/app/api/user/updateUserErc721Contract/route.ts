import { NextResponse, type NextRequest } from "next/server";

/*
import {
	setErc721ContractAddressByWalletAddress,
} from '@lib/api/user';
*/

export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress,
    erc721ContractAddress,
    center,
  } = body;



  let apiURL = "https://owinwallet.com/api/user/updateUserErc721Contract";

  if (
    center === "ppump_orry_bot"
    || center === "ppump_koko_bot"
    || center === "ppump_joajoa_bot"
    || center === "ppump_bigrich_bot"
    || center === "ppump_5515_bot"
  ) {
    apiURL = "https://ppump.me/api/user/updateUserErc721Contract";
  } else if (
    center === "exms_aaa_bot"
  ) {
    apiURL = "https://exms.me/api/user/updateUserErc721Contract";
  }

  

  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress,
      erc721ContractAddress,
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
