import { NextResponse, type NextRequest } from "next/server";

import {
  getOneByWalletAddress,
	updateSeller,
  setEscrowWalletAddressByWalletAddress,
} from '@lib/api/userNoahk';



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



export async function POST(request: NextRequest) {

  const body = await request.json();

  //const { walletAddress, sellerStatus, bankName, accountNumber, accountHolder } = body;
  const { walletAddress, seller } = body;

  //console.log("walletAddress", walletAddress);
  //console.log("sellerStatus", sellerStatus);

 
  // check escrow wallet address is exist

  const user = await getOneByWalletAddress(walletAddress);

  if (!user) {
    return NextResponse.json({
      result: null,
    });
  }

  if (!user.escrowWalletAddress) {




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
      //factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // your own deployed account factory address
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

      



    const resultEscrow = await setEscrowWalletAddressByWalletAddress(
      walletAddress,
      escrowWalletAddress,
      escrowWalletPrivateKey,
    );

    if (!resultEscrow) {
      return NextResponse.json({
        result: null,
      });
    }

  }





  const result = await updateSeller({
    walletAddress: walletAddress,
    seller: seller,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
