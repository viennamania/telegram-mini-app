import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
  getAllMembersByCenter,
} from '@lib/api/user';

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

import {
  getAllGamesSettlement,
  setGamesSettlementByWalletAddressAndSequence,
} from '@lib/api/game';




///import { Network, Alchemy } from 'alchemy-sdk';


//import { useSearchParams } from 'next/navigation'
 

const chain = polygon;


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {

    //const center = "owin_anawin_bot";

    // get parameters from request

    // Error: useSearchParams only works in Client Components. Add the "use client" directive at the top of the file to use it.
    //const searchParams = useSearchParams();
    //console.log("searchParams: ", searchParams);

    //const center = searchParams.get('center');

    //console.log("center: ", center);
    //const center = request.nextUrl.searchParams.get('center');

    //console.log("center: ", center);

  


    //if (!center) {
    //    return NextResponse.error();
    //}


    // check time 
    /*
    const date = new Date();
    const hours = date.getHours() + 9;
    if (hours >= 23 || hours < 9) {

      
      return;
    }
    */




      /*
      const members = await getAllMembersByCenter({
        center: center,
        limit: 500,
        page: 0,
      });

      //console.log("members: ", members);
    
      if (!members) {
        return NextResponse.error();
      }
      */



      const games = await getAllGamesSettlement();

      //console.log("games: ", games);


      if (!games) {
        return NextResponse.json({
          result: "no data found",
        });
      }


    
      const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY || "",
      });
    
      /*
      const contractOptions: ContractOptions = {
        client: client,
        chain: chain,
        address: tokenContractAddressUSDT,
      };
      */
      
      const contractUSDT = getContract(
        //contractOptions
        {
          client: client,
          chain: chain,
          address: tokenContractAddressUSDT,
        }
      );
    
      const claimWalletPrivateKey = process.env.GAME_WALLET_PRIVATE_KEY || "";
    
      const personalAccount = privateKeyToAccount({
        client,
        privateKey: claimWalletPrivateKey,
      });
    
      const wallet = smartWallet({
        chain: chain,
        sponsorGas: true,
      });
    
      const account = await wallet.connect({
        client: client,
        personalAccount: personalAccount,
      });
    
      const gameWalletAddress = account.address;
    
      console.log("gameWalletAddress: ", gameWalletAddress);
      // 0x298288C587dbBc7a7064Aa252ea0848a4F519A5a
      
    
    

      //console.log("members: ", members);


    
      let transactions = [] as any;


      /*
            // send amount is 0.00001 to 0.001
      const sendAmount = 
        Math.random() * (0.001 - 0.00001) + 0.00001;

        */


      games.forEach(async (game : any) => {

        const toWalletAddress = game.walletAddress;

        ///const amount = game.krwAmount;

              // send amount is 0.00001 to 0.001
        //const sendAmount = Number(Math.random() * (0.001 - 0.00001) + 0.00001).toFixed(6);

        //const sendAmount = game.settlement;

        const sendAmount = game.winPrize;

        const transaction = transfer({
          contract: contractUSDT,
          to: toWalletAddress,
          amount: sendAmount,
        });
    
        transactions.push(transaction);


        // update game settlement
        const sequence = game.sequence;

        ///const settlement = sendAmount.toString();

        const result = await setGamesSettlementByWalletAddressAndSequence({
          walletAddress: toWalletAddress,
          sequence: sequence,
        });

    
      } );
    
    

    
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
    

      
      const batchResponse = await sendBatchTransaction(
        batchOptions
      );
      
      console.log("batchResponse: ", batchResponse);

    

    return NextResponse.json({
        
        result: {
            //amount,
            gameWalletAddress,
        },
    });

}
