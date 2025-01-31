import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
	acceptSellOrder,
} from '@lib/api/orderNoahk';



import { ethers } from "ethers";

import {
  createThirdwebClient,

} from "thirdweb";

//import { polygonAmoy } from "thirdweb/chains";
import {
  polygon,
  arbitrum,
 } from "thirdweb/chains";

import {
  privateKeyToAccount,
  smartWallet,
  getWalletBalance,
  
 } from "thirdweb/wallets";




// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, orderId, buyerWalletAddress, buyerNickname, buyerAvatar, buyerMobile, buyerMemo, depositName, depositBankName } = body;

  console.log("orderId", orderId);





  const escrowWalletPrivateKey = ethers.Wallet.createRandom().privateKey;

  //console.log("escrowWalletPrivateKey", escrowWalletPrivateKey);

  if (!escrowWalletPrivateKey) {
    return NextResponse.json({
      result: null,
    });
  }



  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  if (!client) {
    return NextResponse.json({
      result: null,
    });
  }


  const personalAccount = privateKeyToAccount({
    client,
    privateKey: escrowWalletPrivateKey,
  });
    

  if (!personalAccount) {
    return NextResponse.json({
      result: null,
    });
  }
  
  const wallet = smartWallet({
    chain: polygon,
    sponsorGas: true,
  });


  // Connect the smart wallet
  const account = await wallet.connect({
    client: client,
    personalAccount: personalAccount,
  });

  if (!account) {
    return NextResponse.json({
      result: null,
    });
  }


  const escrowWalletAddress = account.address;

    




  

  const result = await acceptSellOrder({
    lang: lang,
    chain: chain,
    orderId: orderId,
    buyerWalletAddress: buyerWalletAddress,
    buyerNickname: buyerNickname,
    buyerAvatar: buyerAvatar,
    buyerMobile: buyerMobile,
    buyerMemo: buyerMemo,
    depositName: depositName,
    depositBankName: depositBankName,
    escrowWalletAddress: escrowWalletAddress,
    escrowWalletPrivateKey: escrowWalletPrivateKey,

  });

  ////console.log("result", result);







 
  return NextResponse.json({

    result,
    
  });
  
}
