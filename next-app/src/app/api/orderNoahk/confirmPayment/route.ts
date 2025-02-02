import { NextResponse, type NextRequest } from "next/server";


import {
  getOneSellOrderForEscrow,
  confirmPayment,
} from '@lib/api/orderNoahk';


import {
	createThirdwebClient,

	///ContractOptions,

	getContract,
	sendAndConfirmTransaction,
	
	sendBatchTransaction,

	SendBatchTransactionOptions,
  
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";

import {
	privateKeyToAccount,
	smartWallet,
	getWalletBalance,
	SmartWalletOptions,
} from "thirdweb/wallets";

import {
	mintTo,
	totalSupply,
	transfer,
  
	
	getBalance,
  
	balanceOf,
  
} from "thirdweb/extensions/erc20";
import { error } from "console";



export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { orderId, paymentMethod, paymentAmount, paymentProof, paymentMemo } = body;

  if (!orderId) {
    return NextResponse.json({
      result: null,
      error: "Missing orderId",
    });
  }


  // getOneSellOrder
  // get escrow wallet private key, toWalletAddress, amount
  const sellOrder = await getOneSellOrderForEscrow({
    orderId: orderId,
  })




  if (!sellOrder) {
    return NextResponse.json({
      result: null,
      error: "Sell order not found",
    });
  }



  const { escrow, walletAddress, sellAmount, buyer} = sellOrder;

  const escrowWalletPrivateKey = escrow.walletPrivateKey;
  const toWalletAddress = buyer.walletAddress;
  const amount = sellAmount;


  console.log("escrowWalletPrivateKey: ", escrowWalletPrivateKey);
  console.log("toWalletAddress: ", toWalletAddress);
  console.log("amount: ", amount);


  const tokenContractAddress = "0x9948328fa1813037a37F3d35C0b1e009d6d9a563"; // NOAH-K on Polygon



  try {


    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });

    
    const contractToken = getContract(
      {
        client: client,
        chain: polygon,
        address: tokenContractAddress,
      }
    );


    const personalAccount = privateKeyToAccount({
      client,
      privateKey: escrowWalletPrivateKey,
    });

    const wallet = smartWallet({
      chain: polygon,
      sponsorGas: true,
    });

    const account = await wallet.connect({
      client: client,
      personalAccount: personalAccount,
    });

    //const claimWalletAddress = account.address;

    //console.log("claimWalletAddress: ", claimWalletAddress);
    // 0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2



    let transactions = [] as any;

    const transaction = transfer({
      contract: contractToken,
      to: toWalletAddress,
      amount: amount,
    });

    transactions.push(transaction);



    const batchOptions: SendBatchTransactionOptions = {
      account: account,
      transactions: transactions,
    };





    const batchResponse = await sendBatchTransaction(
      batchOptions
    );

    if (!batchResponse) {
      return NextResponse.json({
        result: null,
      });
    }

    const escrowTransactionHash = batchResponse.transactionHash;

    const result = await confirmPayment({
      orderId,
      paymentMethod,
      paymentAmount,
      paymentProof,
      paymentMemo,
      escrowTransactionHash,
    });


    if (!result) {
      return NextResponse.json({
        result: null,
      });
    }


    return NextResponse.json({
      result: result,
    });


  } catch (error) {

    console.error("sendBatchTransaction error", error);
    return NextResponse.json({
      result: null,
    });

  }



}
