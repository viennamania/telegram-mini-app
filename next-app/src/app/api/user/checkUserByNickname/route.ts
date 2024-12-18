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
    || center === "ppump_jojo_bot"
  ) {
    apiURL = "https://ppump.me/api/user/checkUserByNickname";
  }
  else if (
          /*
            exms_aaa_bot
            exms_Kyuhongjung_bot
            exms_trj4409_bot
            exms_yun0477_bot
            exms_hyugeso_bot
            exms_csj6588_bot
            exms_kaj7898_bot
            exms_LIM2866_bot
            exms_hmk7529_bot
            exms_Krkr2525_bot
            exms_ksm2465_bot
            exms_nys8364_bot
            exms_yhs0103_bot
            exms_yorke2_bot
            exms_jin3968_bot
            exms_hays7895_bot
            exms_bybb88_bot
            exms_prolife41_bot
            exms_QUAN2388_bot
            */


    center === "exms_aaa_bot"
    || center === "exms_Kyuhongjung_bot"
    || center === "exms_trj4409_bot"
    || center === "exms_yun0477_bot"
    || center === "exms_hyugeso_bot"
    || center === "exms_csj6588_bot"
    || center === "exms_kaj7898_bot"
    || center === "exms_LIM2866_bot"
    || center === "exms_hmk7529_bot"
    || center === "exms_Krkr2525_bot"
    || center === "exms_ksm2465_bot"
    || center === "exms_nys8364_bot"
    || center === "exms_yhs0103_bot"
    || center === "exms_yorke2_bot"
    || center === "exms_jin3968_bot"
    || center === "exms_hays7895_bot"
    || center === "exms_bybb88_bot"
    || center === "exms_prolife41_bot"
    || center === "exms_QUAN2388_bot"

  ) {
    apiURL = "https://exms.me/api/user/checkUserByNickname";
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
