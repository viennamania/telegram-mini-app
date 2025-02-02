import { NextResponse, type NextRequest } from "next/server";



import {
  getAllSellOpenOrders,
	acceptSellOrder,
  getOneSellOrderForEscrow,
} from '@lib/api/orderNoahk';


import {
  getOneByWalletAddress,
} from '@lib/api/userNoahk';

import {
	insertOtcMessageByWalletAddress
} from '@lib/api/telegramNoahk';




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




export async function GET(request: NextRequest) {


  const walletAddress = request.nextUrl.searchParams.get('walletAddress') || "";




  //  getAllSellOpenOrders
  const resultOrders = await getAllSellOpenOrders(
    {
      walletAddress: walletAddress,
      limit: 300,
      page: 1,
    }
  );

  if (!resultOrders) {
    return NextResponse.json({
      result: null,
    });
  }


  const sellOrders = resultOrders.orders;

  //console.log("sellOrders", sellOrders);



  if (!sellOrders) {
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


  const buyerWalletAddress = walletAddress;


  let buyerNickname = "";
  let buyerAvatar = "";
  let buyerMobile = "";
  let buyerMemo = "";
  let depositName = "";
  let depositBankName = "";

  // getOneByWalletAddress
  const user = await getOneByWalletAddress(buyerWalletAddress);

  if (user) {
    buyerNickname = user.nickname;
    buyerAvatar = user.avatar;
    buyerMobile = user.mobile;
    buyerMemo = "";
    depositName = "";
    depositBankName = "";
  }





  //console.log("sellOrders", sellOrders);

  /*
    {
    _id: new ObjectId('679d6b2522cd242d46622060'),
    lang: null,
    chain: null,
    walletAddress: '0xC3f8DA6cD73c214aE5665D2555f14a286F152CB1',
    nickname: 'tel1842',
    mobile: '01057071842',
    avatar: null,
    seller: { bankInfo: [Object] },
    sellAmount: 3,
    krwAmount: 3000,
    rate: 1000,
    createdAt: '2025-02-01T00:30:29.250Z',
    status: 'ordered',
    privateSale: false
  },
  */



  sellOrders.forEach(async (sellOrder: any) => {

  //if (sellOrders.length > 0) {

    //const sellOrder = sellOrders[0];

    const orderId = sellOrder._id.toString();


    // escrowWalletAddress, escrowWalletPrivateKey
    const escrowWalletPrivateKey = ethers.Wallet.createRandom().privateKey;

    if (!escrowWalletPrivateKey) {
      return NextResponse.json({
        result: null,
      });
    }


    const personalAccount = privateKeyToAccount({
      client,
      privateKey: escrowWalletPrivateKey,
    });

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

    if (!result) {
      return NextResponse.json({
        result: null,
      });
    }

    //const tradeId = result.tradeId;

    const acceptedSellOrder = result;


    // telegram message to seller


    const sellerWalletAddress = sellOrder.walletAddress;

    //console.log("sellerWalletAddress", sellerWalletAddress);

    const userSeller = await getOneByWalletAddress(sellerWalletAddress);

    //console.log("userSeller", userSeller);


    if (userSeller) {
      
      const center = userSeller.center;
      
      if (sellerWalletAddress) {

        const messagetext = '구매자가가 구매를 신청하였습니다.';

        const result = await insertOtcMessageByWalletAddress({
          center: center,
          walletAddress: sellerWalletAddress,
          //sellOrder: sellOrder,
          sellOrder: acceptedSellOrder,
          message: messagetext,
        } );

        //console.log("insertOtcMessageByWalletAddress result", JSON.stringify(result));

      }

    }


  } );
  



 
  return NextResponse.json({

    result: "success",
  });





}
