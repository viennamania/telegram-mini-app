import { NextResponse, type NextRequest } from "next/server";

import {
	updateResultByWalletAddressAndSequence,
} from '@lib/api/game';



export async function POST(request: NextRequest) {

  const body = await request.json();

  /*
          walletAddress: walletAddress,
        sequence: selectedSequence,
        seletedOddOrEven: oddOrEven,
        resultOddOrEven: resultOddOrEven, 
        win: win,
        */

  const {
    walletAddress,
    sequence,
    selectedOddOrEven,
    resultOddOrEven,
    win,
  } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await updateResultByWalletAddressAndSequence({
    walletAddress: walletAddress,
    sequence: sequence,
    selectedOddOrEven: selectedOddOrEven,
    resultOddOrEven: resultOddOrEven,
    win: win,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
