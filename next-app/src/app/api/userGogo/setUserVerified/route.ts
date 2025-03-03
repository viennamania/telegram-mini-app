import { NextResponse, type NextRequest } from "next/server";



import {
	insertOneVerified,
} from '@lib/api/userGogo';

import {
  getOneByTelegramId,
} from '@lib/api/referral';

import { Network, Alchemy } from 'alchemy-sdk';


const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);







import {
    createThirdwebClient,

    ///ContractOptions,

    getContract,
    sendAndConfirmTransaction,
    
    sendBatchTransaction,

    SendBatchTransactionOptions,
  
} from "thirdweb";


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


const chain = polygon;

// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';


export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';




export async function POST(request: NextRequest) {

  const body = await request.json();


  const {
    walletAddress,
    nickname,
    userType,
    mobile,
    telegramId,
    center,
  } = body;


  const result = await insertOneVerified({
    walletAddress: walletAddress,
    nickname: nickname,
    userType: userType,
    mobile: mobile,
    telegramId: telegramId,
    center: center,
  });


  const user = await getOneByTelegramId(telegramId, center);

  if (user) {
    const referralCode = user.referralCode;
    // referralCode: 0xCb90a16C8cb359E5bca702283BC6E2ea756DfB9f_4
    // contractAddress: 0x495f947276749Ce646f68AC8c248420045cb7b5e
    // tokenId: 4

    const nftContractAddress = referralCode.split('_')[0];
    const tokenId = referralCode.split('_')[1];


    // Get owner of NFT
    const owner = await alchemy.nft.getOwnersForNft(
      nftContractAddress,
      tokenId
    );

    ///console.log("owner: ", owner);


    /*
    {
      owners: [ '0xAcDb8a6c00718597106F8cDa389Aac68973558B3' ],
      pageKey: null
    }
    */

    const ownerWalletAddress = owner.owners[0];


    if (ownerWalletAddress) {

      console.log("ownerWalletAddress: ", ownerWalletAddress);

      const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY || "",
      });
      
      const contractUSDT = getContract(
        {
          client: client,
          chain: chain,
          address: tokenContractAddressUSDT,
        }
      );
    
      const claimWalletPrivateKey = process.env.CLAIM_WALLET_PRIVATE_KEY || "";
    
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
    
      ///const claimWalletAddress = account.address;
    

      let transactions = [] as any;
    
      const sendAmount = 1;

      const transaction = transfer({
        contract: contractUSDT,
        to: ownerWalletAddress,
        amount: sendAmount,
      });
  
      transactions.push(transaction);
  

    
    
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
    
      const batchResponse = await sendBatchTransaction(
        batchOptions
      );

      console.log("batchResponse: ", batchResponse);


    }


  }
  



  return NextResponse.json({

    result,
    
  });

  
}
