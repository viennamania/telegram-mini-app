import { NextResponse, type NextRequest } from "next/server";

import {
    getTransferByWalletAddress,
} from '@lib/api/transferNoahNft';


export async function POST(request: NextRequest) {

    const body = await request.json();

    const {
        limit,
        page,
        walletAddress,
        tokenId,
    } = body;


    //console.log("getTransferByWalletAddress walletAddress", walletAddress);


    const result = await getTransferByWalletAddress({
        limit: limit || 100,
        page: page || 0,
        walletAddress: walletAddress,
        contractAddress: "0xd1FAE297D2E28Fc7e4a6333A8E60Aff7603D1B04",
        tokenId: tokenId,
    });

    if (!result) {
        return NextResponse.json({ error: { message: "No data found" } });
    }


    return NextResponse.json(result);


}


