import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';

import { Network, Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';



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
    //totalSupply,
    transfer,
    
    getBalance,
  
    //balanceOf,
  
} from "thirdweb/extensions/erc20";

import {
  getNFT,

  balanceOf,
  
  totalSupply,
  
} from "thirdweb/extensions/erc1155";


///import { Network, Alchemy } from 'alchemy-sdk';


//import { useSearchParams } from 'next/navigation'
 

const chain = polygon;


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);




export async function GET(request: NextRequest) {

    //const center = "owin_anawin_bot";

    // get parameters from request

    // Error: useSearchParams only works in Client Components. Add the "use client" directive at the top of the file to use it.
    //const searchParams = useSearchParams();
    //console.log("searchParams: ", searchParams);

    //const center = searchParams.get('center');

    //console.log("center: ", center);
    const center = request.nextUrl.searchParams.get('center');

    console.log("center: ", center);

  

    
    if (!center) {
        return NextResponse.error();
    }
    


    // check time 
    /*
    const date = new Date();
    const hours = date.getHours() + 9;
    if (hours >= 23 || hours < 9) {

      
      return;
    }
    */


    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });


    const tokenContractAddressErc1155 = '0xE6BeA856Cd054945cE7A9252B2dc360703841028';



    const tokenContractAddressNOAHS = '0xdd200c6EF8e5fe9b1332224a86b5980D202d4d9d';



    const contractErc1155 = getContract(
      {
        client: client,
        chain: chain,
        address: tokenContractAddressErc1155,
      }
    );


    const tokenId = BigInt(5);



    const nft = await getNFT({
      contract: contractErc1155,
      //tokenId: 0n,
      //tokenId: BigInt(0),

      tokenId: tokenId,
    });

    console.log("nft", nft);
    /*
    nft {
      metadata: {
        name: '100 NOAH MINING',
        description: '',
        background_color: '',
        external_url: '',
        customImage: '',
        customAnimationUrl: '',
        animation_url: 'ipfs://QmXa48CAigywF9QMEJvVXX4RGBXAoSiuL7Em7t94rAxVsK/0.mp4',
        image: 'ipfs://QmXa48CAigywF9QMEJvVXX4RGBXAoSiuL7Em7t94rAxVsK/1.jpeg'
      },
      owner: null,
      id: 0n,
      tokenURI: 'ipfs://QmVtBg1odf85cyySZfdrirzHG4zo8tshfsCk7zfZYwuuTS/0',
      type: 'ERC1155',
      supply: 30n
    }
    */

    // total supply of the nft contract
    const totalSupplyResult = await totalSupply({
      contract: contractErc1155,
      id: tokenId,
    });

    console.log("totalSupplyResult", totalSupplyResult);



    /*
    try {

      
      let pageKey;

      
      const response = await alchemy.core.getAssetTransfers({
        fromBlock: '0x0',
        toBlock: 'latest',

        fromAddress: "0x0000000000000000000000000000000000000000",

        category: [AssetTransfersCategory.ERC1155],

        contractAddresses: [tokenContractAddressErc1155], // Replace with the address of your NFT contract.

        order: SortingOrder.DESCENDING, // Sort the results in descending order.
        
        //pageKey: pageKey, // The pageKey is used to paginate through the API call.
      });
   


      console.log("res", response);
      // reason: 'missing response',
      // serverError: TypeError: Referrer "client" is not a valid URL.
    
    } catch (error) {
      console.error("error", error);
    }
    */



    // get holders of the nft contract
    const result = await alchemy.nft.getOwnersForContract(
      tokenContractAddressErc1155);


    //console.log("result", result);
    /*
      {    owners: [
        '0x1ab86ceA8DcFBdD56DF8086f5190a2C6d5795C94',
        '0x3C9C78c24148e52393221347af3D3F74A5729e5f',
        '0x542197103Ca1398db86026Be0a85bc8DcE83e440',
        '0x58a9E653ded2004ff94e5Fa3f342412a7B4cc563',
        '0x7071060C66d4f365CdE477436Ca02509912054fF',
        '0xA8B4BE80b986BD6868A2778fAD135aE51f79C332',
        '0xc147840E00F1840183de52FE57AC04ed3d474442',
        '0xC3f8DA6cD73c214aE5665D2555f14a286F152CB1',
        '0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C'
      ],
      pageKey: undefined,
    }
    */

    // if tokenId is 5,
    // then 0.8%, 0.1%, 0.1%, 0.2%

    const masterWalletAddress = "0x1ab86ceA8DcFBdD56DF8086f5190a2C6d5795C94";
    let masterAmount = 0.0;
    const agentWalletAddress = "0x3C9C78c24148e52393221347af3D3F74A5729e5f";
    let agentAmount = 0.0;
    const centerWalletAddress = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
    let centerAmount = 0.0;
    const platformWalletAddress = "0x58a9E653ded2004ff94e5Fa3f342412a7B4cc563";
    let platformAmount = 0.0;





    
    if (result && result.owners && result.owners.length > 0) {

      result.owners.map(async (owner : any) => {

        //const owner = result.owners[0];

        
        const balanceResult = await balanceOf({
            contract: contractErc1155,
            owner: owner,
            tokenId: tokenId,
        });

        //console.log("balanceResult", balanceResult);

        // balanceResult 1n

        const balance = balanceResult.toString();

        /*
        const airdropAmount = 10;

        const share = ((Number(balance) / Number(totalSupplyResult.toString())) * airdropAmount).toFixed(6);
      

        console.log("owner: ", owner, "balance: ", balance, "share: ", share);
        */





        let shareTotalAmount = 0.0;

        if (tokenId === BigInt(0)) {
          shareTotalAmount = 100.0;
          masterAmount = shareTotalAmount * 0.3;
          agentAmount = shareTotalAmount * 0.6;
          centerAmount = shareTotalAmount * 0.1;
          platformAmount = shareTotalAmount * 0.2;
        } else if (tokenId === BigInt(1)) {
          shareTotalAmount = 100.0;
          masterAmount = shareTotalAmount * 0.4;
          agentAmount = shareTotalAmount * 0.5;
          centerAmount = shareTotalAmount * 0.1;
          platformAmount = shareTotalAmount * 0.2;
        } else if (tokenId === BigInt(2)) {
          shareTotalAmount = 100.0;
          masterAmount = shareTotalAmount * 0.5;
          agentAmount = shareTotalAmount * 0.4;
          centerAmount = shareTotalAmount * 0.1;
          platformAmount = shareTotalAmount * 0.2;
        } else if (tokenId === BigInt(3)) {
          shareTotalAmount = 100.0;
          masterAmount = shareTotalAmount * 0.6;
          agentAmount = shareTotalAmount * 0.3;
          centerAmount = shareTotalAmount * 0.1;
          platformAmount = shareTotalAmount * 0.2;
        } else if (tokenId === BigInt(4)) {
          shareTotalAmount = 100.0;
          masterAmount = shareTotalAmount * 0.7;
          agentAmount = shareTotalAmount * 0.2;
          centerAmount = shareTotalAmount * 0.1;
          platformAmount = shareTotalAmount * 0.2;
        } else if (tokenId === BigInt(5)) {
          shareTotalAmount = 10.0;
          masterAmount = shareTotalAmount * 0.8;
          agentAmount = shareTotalAmount * 0.1;
          centerAmount = shareTotalAmount * 0.1;
          platformAmount = shareTotalAmount * 0.2;
        }







      });

    }






    /*
    const response = await alchemy.nft.getNftsForOwner(
      walletAddress, {
      omitMetadata: false, // // Flag to omit metadata
    });
  
    ///console.log("response?.ownedNfts", response?.ownedNfts);
  
  
    // get tokenType is 'ERC721' from the response
  
    response?.ownedNfts?.map((nft) => {
    */






      const members = await getAllMembersByCenter({
        center: center,
        limit: 500,
        page: 0,
      });

      //console.log("members: ", members);
    
      if (!members) {
        return NextResponse.error();
      }


      return NextResponse.json({
        
        result: {
            members,
        },
      });


      /*
      //console.log("members: ", members);
    
      // amount is random from 0.00001 to 0.1
      const amount = Math.random() * (1 - 0.00001) + 0.00001;

    
      const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY || "",
      });
    
      
      //const contractOptions: ContractOptions = {
      //  client: client,
      //  chain: chain,
      //  address: tokenContractAddressUSDT,
      //};
      
      
      const contractUSDT = getContract(
        //contractOptions
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
    
      const claimWalletAddress = account.address;
    
      //console.log("claimWalletAddress: ", claimWalletAddress);
      // 0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2
    
    

      //console.log("members: ", members);

    
      let transactions = [] as any;
    
      const sendAmount = amount / members.length;
    
      members.forEach(async (member : any) => {
    
        const toWalletAddress = member.walletAddress;

        const transaction = transfer({
          contract: contractUSDT,
          to: toWalletAddress,
          amount: sendAmount,
        });
    
        transactions.push(transaction);
    
      } );
    

    

    
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
    
      const batchResponse = await sendBatchTransaction(
        batchOptions
      );



    return NextResponse.json({
        
        result: {
            members,
            amount,
            claimWalletAddress,
        },
    });
    */

}
