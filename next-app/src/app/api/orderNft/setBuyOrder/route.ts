import { NextResponse, type NextRequest } from "next/server";

import {
	insertBuyOrder,
} from '@lib/api/orderNft';



export async function POST(request: NextRequest) {

  const body = await request.json();

  //const { walletAddress, nickname, usdtAmount, krwAmount, rate, privateSale, buyer } = body;

  ///console.log("setBuyOrder =====  walletAddress", walletAddress);
  
  /*
                      walletAddress: address,
                    contractAddress: erc1155ContractAddress,
                    tokenId: tokenId,
                    usdtPrice: usdtPrice,
                    fee: fee,
                    tax: tax,
                    rate: rate,
                    krwPrice: krwPrice,
  */

  const {
    walletAddress,
    contractAddress,
    tokenId,
    usdtPrice,
    fee,
    tax,
    rate,
    krwPrice,
    paymentInfo,
    depositName,
  } = body;



  const result = await insertBuyOrder({
    walletAddress: walletAddress,
    contractAddress: contractAddress,
    tokenId: tokenId,
    usdtPrice: usdtPrice,
    fee: fee,
    tax: tax,
    rate: rate,
    krwPrice: krwPrice,
    paymentInfo: paymentInfo,
    depositName: depositName,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
