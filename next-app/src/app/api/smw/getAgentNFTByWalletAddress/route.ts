import { NextResponse, type NextRequest } from "next/server";

import { Network, Alchemy } from 'alchemy-sdk';


import {
  getAllErc721ContractAddresses,
} from '@lib/api/user';


const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress,
    ///erc721ContractAddress,
  } = body;


  ///console.log("getAgentNFTByWalletAddress walletAddress", walletAddress);

  // get erc721ContractAddress array from the database

  //const erc721ContractAddresses = await getAllErc721ContractAddresses();

  //console.log("erc721ContractAddresses", erc721ContractAddresses);


  /*
  // {"error":{"message":"Contract address filter size of: 58 is greater than the maximum allowed of: 45!"}}

  // 45 of erc721ContractAddresses is the maximum allowed
  // so we need to limit the erc721ContractAddresses to 45


  let finalResult: any = [];



  let contractAddresses = erc721ContractAddresses.slice(0, 45);

  const response = await alchemy.nft.getNftsForOwner(
    walletAddress, {
    omitMetadata: false, // // Flag to omit metadata
    ////contractAddresses: [erc721ContractAddress],

    contractAddresses: contractAddresses,
  });

  response?.ownedNfts?.map((nft) => {
    finalResult.push(nft);
  });

  //console.log("finalResult", finalResult);

  if (erc721ContractAddresses.length <= 45) {
    return NextResponse.json({
      result: {
        ownedNfts: finalResult,
      }
    });
  }


  

  contractAddresses = erc721ContractAddresses.slice(45, 90);
  const response2 = await alchemy.nft.getNftsForOwner(
    walletAddress, {
    omitMetadata: false, // // Flag to omit metadata
    ////contractAddresses: [erc721ContractAddress],

    contractAddresses: contractAddresses,
  });

  response2?.ownedNfts?.map((nft) => {
    finalResult.push(nft);
  });


  //console.log("finalResult", finalResult);
  

  if (!response) {
    return NextResponse.json({
      result: {
        ownedNfts: [],
      }
    });
    
  }

  */

  let finalResult: any = [];



  try {

    const response = await alchemy.nft.getNftsForOwner(
      walletAddress,
      {
        omitMetadata: false, // // Flag to omit metadata
        //smw nft contract address
        contractAddresses: ["0xb3f4f5396075c4141148B02D43bF54C5Da6525dD"], // contractAddresses: [erc721ContractAddress],
      }
    );


    ///console.log("response?.ownedNfts", response?.ownedNfts);


    // get tokenType is 'ERC721' from the response

    response?.ownedNfts?.map((nft) => {

      //console.log("nft", nft);
      /*
      const agentContractAddress = nft.contract.address;
      const agentNumber = nft.tokenId;

      // api call to get application count for the agent
      */

      /*
      if (nft.tokenType === 'ERC721') {

        // granderby horse nft
        if (nft.contract.address === "0x41FBA0bd9f4DC9a968a10aEBb792af6A09969F60") {
          finalResult.push(nft);
          return;
        }

        if (nft.contract.isSpam === true) {
          return;
        }

        finalResult.push(nft);

      }
      */

      finalResult.push(nft);

    });

  } catch (error) {
    console.log("error", error);
  }




 
  return NextResponse.json({

    result: {
      ownedNfts: finalResult,
    }
    
  });
  
}
