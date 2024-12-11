import { NextResponse, type NextRequest } from "next/server";

/*
import {
	getOneByNickname,
} from '@lib/api/user';
*/


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { nickname, center } = body;



  /*
  const result = await getOneByNickname(nickname);

  if (result) {
    return NextResponse.json({
      result: true
    });
  }
  */

  let apiURL = "https://owinwallet.com/api/user/checkUserByNickname";

  if (
    center === "ppump_orry_bot"
    || center === "ppump_koko_bot"
    || center === "ppump_joajoa_bot"
    || center === "ppump_bigrich_bot"
    || center === "ppump_5515_bot"
  ) {
    apiURL = "https://ppump.me/api/user/checkUserByNickname";
  }

  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname: nickname,
    }),
  });

  if (!response.ok) {
    return NextResponse.error();
  }

  const jsonObj = await response.json();

 
  return NextResponse.json({
    result: jsonObj?.result,
  });
  
}
