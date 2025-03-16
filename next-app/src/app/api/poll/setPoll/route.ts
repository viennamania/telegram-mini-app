import { NextResponse, type NextRequest } from "next/server";

import {
	updateUserOne,
} from '@lib/api/poll';



export async function POST(request: NextRequest) {


  /*
          sequence: selectedSequence,
        user: dataUser,
        selectedOddOrEven: selectedOddOrEven,
  */


  const body = await request.json();

  const {
    sequence,
    user,
    selectedOddOrEven,
  } = body;

  //console.log("walletAddress", walletAddress);
  

  const result = await updateUserOne({
    sequence: sequence,
    user: user,
    selectedOddOrEven: selectedOddOrEven,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
