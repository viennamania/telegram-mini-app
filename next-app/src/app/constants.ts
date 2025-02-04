import { createThirdwebClient, getContract } from "thirdweb";
import {
	polygon,
	//baseSepolia,
	//defineChain
} from "thirdweb/chains";
import { inAppWallet, SmartWalletOptions } from "thirdweb/wallets";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID

//const clientId = process.env.THIRDWEB_CLIENT_ID;

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

if (!clientId) {
	throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
	clientId: clientId,
});



//export const chain = baseSepolia;
export const chain = polygon;


export const wallet = inAppWallet({
	smartAccount: {
		sponsorGas: true,
		chain: chain
	}
});







///export const tokenDropAddress = "0xd64A548A82c190083707CBEFD26958E5e6551D18";

export const tokenDropAddress = "0x4035Aae05709C690023D29a0acFd904b5dEe7c23";


//export const editionDropAddress = "0x638263e3eAa3917a53630e61B1fBa685308024fa";

export const editionDropAddress = "0x5F5388f6c76BF521bf4E70F1A11589EB88F38ba0";

export const editionDropTokenId = 0n;



//export const oeNFTAddress = "0xC28202BF7076B8C18BDE211AE371Ff674DadD7BE";
export const oeNFTAddress = "0x6F8eA79f04517F40609DA844Fa756D3Aa8bed3cd";



export const oeNFTContract = getContract({
	address: oeNFTAddress,
	
	//chain: defineChain(8333),
	chain,


	client,
});




export const editionDropContract = getContract({
	address: editionDropAddress,
	chain,
	client,
});

export const tokenDropContract = getContract({
	address: tokenDropAddress,
	chain,
	client,
});

export const accountAbstraction: SmartWalletOptions = {
	chain,
	sponsorGas: true,
};