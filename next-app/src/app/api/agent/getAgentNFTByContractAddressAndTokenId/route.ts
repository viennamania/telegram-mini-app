import { NextResponse, type NextRequest } from "next/server";

import { Network, Alchemy } from 'alchemy-sdk';


import {
  getOneByWalletAddress
} from "@/lib/api/user";


const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    erc721ContractAddress,
    tokenId
  } = body;


  if (!erc721ContractAddress) {

    return NextResponse.error();
  }

  console.log("erc721ContractAddress: ", erc721ContractAddress);
  console.log("tokenId: ", tokenId);



  /*
  const response = await alchemy.nft.getNftsForOwner(
    walletAddress, {
    omitMetadata: false, // // Flag to omit metadata
    contractAddresses: [erc721ContractAddress],
  });
  */
  /*
  const response = await alchemy.nft.getNftsForContract(
    erc721ContractAddress, {
    omitMetadata: false, // // Flag to omit metadata
  });
  */
  const response = await alchemy.nft.getNftMetadata(
    erc721ContractAddress,
    tokenId
  );

  ///console.log("response: ", response);

  if (!response) {
    return NextResponse.json({
      result: [],
    });
    
  }

 
  // Get owner of NFT
  const owner = await alchemy.nft.getOwnersForNft(
    erc721ContractAddress,
    tokenId
  );

  ///console.log("owner: ", owner);


  /*
  {
    owners: [ '0xAcDb8a6c00718597106F8cDa389Aac68973558B3' ],
    pageKey: null
  }
  */


  const user = await getOneByWalletAddress(owner?.owners?.[0]);






  // https://na.winglobalpay.com/api/v1/reqUserAccountInfo
  // *헤더에 content-type: application/json; charset=utf-8
  // Authorization
  // *가맹점 api key는 윈글로벌페이 관리자에게 요청
  /*
  가맹점 아이디 : w63791online
API KEY : pk_ee40-3825fb-38a-a5395

가맹점 아이디 : w63792online
API KEY : pk_096e-0d7e93-200-a34f0
  */
 /*
 {
    "bankCd": "034"
  }
    034:광주은행, 039:경남은행
  */

  /*
  const response2 = await fetch('https://na.winglobalpay.com/api/v1/reqUserAccountInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': process.env.WINGLOBALPAY_API_KEY || '',
    },
    body: JSON.stringify({
      bankCd: '034',
      //bankCd: '',
    })
  });

  const response2Json = await response2.json();
  */


  //console.log("response2Json: ", response2Json);
  // response2Json:  { msg: '키를 확인해주세요.', flag: 'fail' }

  /*
  response2Json:  {
    msg: '조회가 성공하였습니다.',
    flag: 'success',
    data: {
      holderName: '(주)앳게이트',
      possibleAmt: 0,
      transferLimit: '10,000,000',
      realPossibleAmt: 0,
      transferFee: 1000,
      bankName: '하나은행',
      holdAmt: 0,
      afterOneHourAmt: 0,
      account: '27991002361104'
    }
  }
  */






  return NextResponse.json({

    result: response,
    ownerWalletAddress: owner?.owners?.[0],
    ownerInfo: user,
    
  });
  
}
