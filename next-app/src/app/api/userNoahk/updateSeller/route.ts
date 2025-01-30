import { NextResponse, type NextRequest } from "next/server";

import {
	updateSeller
} from '@lib/api/userNoahk';



export async function POST(request: NextRequest) {

  const body = await request.json();

  //const { walletAddress, sellerStatus, bankName, accountNumber, accountHolder } = body;
  const { walletAddress, seller } = body;

  //console.log("walletAddress", walletAddress);
  //console.log("sellerStatus", sellerStatus);

 


  const result = await updateSeller({
    walletAddress: walletAddress,
    seller: seller,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
