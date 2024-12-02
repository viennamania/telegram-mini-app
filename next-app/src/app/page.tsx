"use client";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { client, wallet } from "./constants";
import { AutoConnect } from "thirdweb/react";
import Link from "next/link";
import { useEffect } from "react";


export default function Home() {

  
  const account = useActiveAccount();

  useEffect(() => {
    console.log('account', account);
  }, [account]);



  
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        {/*
        <Header />
        */}

        <AutoConnect
          client={client}
          wallets={[wallet]}
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

        <Menu />

      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block text-blue-500"> Telegram </span>
      </h1>

    </header>
  );
}

function Menu() {
	return (
		<div className="grid gap-4 lg:grid-cols-3 justify-center">
      <MenuItem
        title="프로필"
        href="/profile"
        description="프로필을 확인하고 수정합니다."
      />
			<MenuItem
				title="NFT 생성"
				href="/gasless"
				description="가스비 없이 NFT를 생성합니다."
			/>
      <MenuItem
				title="Pay"
				href="/pay"
				description="Allow users to purchase NFT's using fiat"
			/>
		</div>
	);
}

function MenuItem(props: { title: string; href: string; description: string }) {
	return (
		<Link
			href={props.href}
			className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-200 hover:bg-opacity-10"
		>
			<article>
				<h2 className="text-lg font-semibold mb-2">{props.title}</h2>
				<p className="text-sm text-zinc-400">{props.description}</p>
			</article>
		</Link>
	);
}

