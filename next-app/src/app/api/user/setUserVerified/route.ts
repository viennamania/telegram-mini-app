import { NextResponse, type NextRequest } from "next/server";


/*
import {
	insertOneVerified,
} from '@lib/api/user';
*/


export async function POST(request: NextRequest) {

  const body = await request.json();


  const {
    walletAddress,
    nickname,
    userType,
    mobile,
    telegramId,
    center,
  } = body;

  

  /*
  const result = await insertOneVerified({
    walletAddress: walletAddress,
    nickname: nickname,
    userType: userType,
    mobile: mobile,
    telegramId: telegramId,
    center: center,
  });
  */

  let apiURL = "https://owinwallet.com/api/user/setUserVerified";

  if (center === "ppump_orry_bot") {
    apiURL = "https://aiagentbot.vercel.app/api/user/setUserVerified";
  }



  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: walletAddress,
      nickname: nickname,
      userType: userType,
      mobile: mobile,
      telegramId: telegramId,
      center: center,
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
