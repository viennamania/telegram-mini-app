import { NextResponse, type NextRequest } from "next/server";

import {
	updateRaceGameResultByWalletAddressAndSequence,
} from '@lib/api/game';



export async function POST(request: NextRequest) {

  const body = await request.json();



  const {
    walletAddress,
    sequence,
    selectedNumber,
    horseRanking,
    resultNumber,
    win,
  } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await updateRaceGameResultByWalletAddressAndSequence({
    walletAddress: walletAddress,
    sequence: sequence,
    selectedNumber: selectedNumber,
    horseRanking: horseRanking,
    resultNumber: resultNumber,
    win: win,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
