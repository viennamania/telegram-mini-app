"use client";
import type React from "react";
import { claimTo, getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
	ConnectButton,
	MediaRenderer,
	TransactionButton,
	useActiveAccount,
	useReadContract,
} from "thirdweb/react";
import {
	accountAbstraction,
	client,
	wallet,
	editionDropContract,
	editionDropTokenId,
} from "../constants";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { AutoConnect } from "thirdweb/react";

import Link from "next/link";



const GaslessHome: React.FC = () => {

	const account = useActiveAccount();



	const { data: nft, isLoading: isNftLoading } = useReadContract(getNFT, {
		contract: editionDropContract,
		tokenId: editionDropTokenId,
	});
	const { data: ownedNfts } = useReadContract(getOwnedNFTs, {
		contract: editionDropContract,
		address: account?.address!,
		queryOptions: { enabled: !!account },
	});

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-12 text-zinc-800">
				NFT Claim
			</h1>

			<AutoConnect
				client={client}
				wallets={[wallet]}
				timeout={15000}
			/>

			
			<div className="flex justify-center mb-20">
			{account ? 
				(
				<> 
					<Button
					onClick={() => (window as any).Telegram.WebApp.openLink(`https://polygonscan.com/address/${account.address}`)}
					className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
					>
					내 지갑주소: {shortenAddress(account.address)}
					</Button>  
				</>
				) 
			: (
				<p className="text-sm text-zinc-400">
					연결된 지갑이 없습니다.
				</p>
				)}      
			</div>

			<div className="flex flex-col">
				{isNftLoading ? (
					<div className="w-full mt-24">Loading...</div>
				) : (
					<>
						{nft ? (
							<MediaRenderer
								client={client}
								src={nft.metadata.image}
								style={{ width: "50%", marginTop: "10px" }}
							/>
						) : null}
						{account ? (
							<>
								<p className="font-semibold text-center mb-2">
									You own {ownedNfts?.[0]?.quantityOwned.toString() || "0"}{" "}
									Winters
								</p>
								<TransactionButton payModal={false}
									transaction={() =>
										claimTo({
											contract: editionDropContract,
											tokenId: editionDropTokenId,
											to: account.address,
											quantity: 1n,
										})
									}
									onError={(error) => {
										alert(`Error: ${error.message}`);
									}}
									onTransactionConfirmed={async () => {
										alert("Claim successful!");
									}}
								>
									Claim!
								</TransactionButton>
							</>
						) : (
							<p
								style={{
									textAlign: "center",
									width: "100%",
									marginTop: "10px",
								}}
							>
								Login to claim this Kitten!
							</p>
						)}
					</>
				)}
			</div>
			<Link href={"/"} className="text-sm text-gray-400 mt-8">
				Back to menu
			</Link>
		</div>
	);
};

export default GaslessHome;
