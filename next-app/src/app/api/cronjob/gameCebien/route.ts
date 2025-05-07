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
} from '@lib/api/gameCebien';


import {
  getOneByWalletAddress,
} from '@lib/api/user';

import {
  getOneByTelegramId,
} from '@lib/api/referral';



import { Network, Alchemy } from 'alchemy-sdk';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);



 

const chain = polygon;


// USDT Token (USDT)
//const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

const tokenContractAddressCEBIEN = '0x04a4B27d8221A57b4051AbAc170d4ac5Abdc6aBd';



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
      
      const contractCEBIEN = getContract(
        //contractOptions
        {
          client: client,
          chain: chain,
          ///address: tokenContractAddressUSDT,
          address: tokenContractAddressCEBIEN,
        }
      );
    
      const claimWalletPrivateKey = process.env.GAME_CEBIEN_WALLET_PRIVATE_KEY || "";
    
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


      const games = await getAllGamesSettlement();

      //console.log("games: ", games);


      if (!games) {
        return NextResponse.json({
          result: "no data found",
        });
      }


    
      let transactions = [] as any;


      /*
            // send amount is 0.00001 to 0.001
      const sendAmount = 
        Math.random() * (0.001 - 0.00001) + 0.00001;

        */



      //games.forEach(async (game : any) => {
      // sync

      let j = 0;

      for (let i = 0; i < games.length; i++) {

        if (j > 50) {
          break;
        }
        j++;

        const game = games[i];

        const toWalletAddress = game.walletAddress;

        ///const amount = game.krwAmount;

              // send amount is 0.00001 to 0.001
        //const sendAmount = Number(Math.random() * (0.001 - 0.00001) + 0.00001).toFixed(2);

        //const sendAmount = game.settlement;

        const sendAmount = game.winPrize;

        const transaction = transfer({
          contract: contractCEBIEN,
          to: toWalletAddress,
          amount: sendAmount,
        });
    
        transactions.push(transaction);






        // 10% of gaem.winPrize to referral

        // get telegram id from users by wallet address
        // find referral from members by wallet address

        let ownerWalletAddress = "";
        let ownerAmount = "";
   
        const user = await getOneByWalletAddress(toWalletAddress);

        //console.log("user: ", user);

        if (user) {
          const telegramId = user.telegramId;
          const center = user.center;

          const response = await getOneByTelegramId(telegramId, center);

          //console.log("response: ", response);

          /*
          {
            "_id": {
              "$oid": "67860af11cbd056942632b2d"
            },
            "telegramId": "441516803",
            "referralCode": "0x4BC23C679e3E2aac58D43Bb5257281562FB01e04_0"
          }
          */

          if (response && response.referralCode) {

            const referralCode = response.referralCode;

            

            // get contract address and tokenId from referralCode
            const referralCodeArray = referralCode.split("_");
            const contractAddress = referralCodeArray[0];
            const tokenId = referralCodeArray[1];


            console.log("contractAddress: ", contractAddress);
            console.log("tokenId: ", tokenId);

            if (contractAddress && tokenId) {

              // Get owner of NFT
              const owner = await alchemy.nft.getOwnersForNft(
                contractAddress,
                tokenId
              );

              console.log("owner: ", owner);



              ownerWalletAddress = owner?.owners?.[0];

              console.log("ownerWalletAddress: ", ownerWalletAddress );


              ownerAmount = Number(parseFloat(sendAmount) * 0.1).toFixed(2);

              console.log("ownerAmount: ", ownerAmount );


              if (ownerWalletAddress) {

                const ownerTransaction = transfer({
                  contract: contractCEBIEN,
                  to: ownerWalletAddress,
                  amount: ownerAmount,
                });

                transactions.push(ownerTransaction);

              }

            } else {
              console.log("referralCode: ", referralCode);
              console.log("contractAddress or tokenId is empty");
            }


          

            
          }

        }







        const userOwnerOwner = await getOneByWalletAddress(ownerWalletAddress);

        //console.log("user: ", user);

        if (userOwnerOwner) {
          const telegramId = userOwnerOwner.telegramId;
          const center = userOwnerOwner.center;

          const response = await getOneByTelegramId(telegramId, center);

          if (response && response.referralCode) {

            const referralCode = response.referralCode;

            // get contract address and tokenId from referralCode
            const referralCodeArray = referralCode.split("_");
            const contractAddress = referralCodeArray[0];
            const tokenId = referralCodeArray[1];


            console.log("contractAddress: ", contractAddress);
            console.log("tokenId: ", tokenId);


            if (contractAddress && tokenId) {

              // Get owner of NFT
              const ownerOwner = await alchemy.nft.getOwnersForNft(
                contractAddress,
                tokenId
              );



              const ownerOwnerWalletAddress = ownerOwner?.owners?.[0];

              console.log("ownerOwnerWalletAddress: ", ownerOwnerWalletAddress );


              const ownerOwnerAmount = Number(parseFloat(sendAmount) * 0.05).toFixed(2);

              console.log("ownerOwnerAmount: ", ownerOwnerAmount );


              if (ownerOwnerWalletAddress) {

                const ownerOwnerTransaction = transfer({
                  contract: contractCEBIEN,
                  to: ownerOwnerWalletAddress,
                  amount: ownerOwnerAmount,
                });

                transactions.push(ownerOwnerTransaction);

              }

            } else {
              console.log("referralCode: ", referralCode);
              console.log("contractAddress or tokenId is empty");
            }

            
          }

        }





            








        // update game settlement
        const sequence = game.sequence;

        ///const settlement = sendAmount.toString();

        const result = await setGamesSettlementByWalletAddressAndSequence({
          walletAddress: toWalletAddress,
          sequence: sequence,
        });

    
      }


    
    

      if (transactions.length === 0) {
        return NextResponse.json({
          result: "no data found",
        });
      }


      //console.log("transactions: ", transactions);

    
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
