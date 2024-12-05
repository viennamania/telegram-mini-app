"use client";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { client, wallet } from "./constants";

import {
  AutoConnect
} from "thirdweb/react";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

import { useSearchParams } from "next/navigation";


function HomeContent() {

  const searchParams = useSearchParams();

  
  const [params, setParams] = useState({ center: '' });

  
  useEffect(() => {
      const center = searchParams.get('center') || '';
      setParams({ center });
  }, [searchParams]);


  
  const account = useActiveAccount();

  /*
  useEffect(() => {
    console.log('account', account);
  }, [account]);
  */





  const [nickname, setNickname] = useState("");

  const [avatar, setAvatar] = useState("/profile-default.png");


  const [userCode, setUserCode] = useState("");



  const [seller, setSeller] = useState(null) as any;


  const [isAgent, setIsAgent] = useState(false);

  const [referralCode, setReferralCode] = useState("");

  const [erc721ContractAddress, setErc721ContractAddress] = useState("");

  const [userCenter, setUserCenter] = useState("");

  useEffect(() => {
      const fetchData = async () => {
          const response = await fetch("/api/user/getUser", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  walletAddress: account?.address,
              }),
          });

          const data = await response.json();

          ///console.log("data", data);

          if (data.result) {
              setNickname(data.result.nickname);
              
              data.result.avatar && setAvatar(data.result.avatar);
              

              setUserCode(data.result.id);

              setSeller(data.result.seller);

              setIsAgent(data.result.agent);

              ///setReferralCode(data.result.erc721ContractAddress);
              setErc721ContractAddress(data.result.erc721ContractAddress);

              setUserCenter(data.result.center);

          } else {
              setNickname('');
              setAvatar('/profile-default.png');
              setUserCode('');
              setSeller(null);


              setIsAgent(false);

              setReferralCode('');

              setErc721ContractAddress('');

              setUserCenter('');
          }

      };

      fetchData();

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

        {/* center */}
        <div className="flex justify-center">
          <p className="text-lg text-zinc-800">
            Center: {params.center}
          </p>
        </div>

        
        <div className="flex justify-center mb-5">
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

        {/* 사용자 소속 센터 */}
        {account && (
          <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
              <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                  사용자 소속 센터
              </div>
              <div className='flex flex-row gap-2 items-center justify-between'>
                  <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                      {userCenter}
                  </div>
              </div>
          </div>
        )}


        <Menu
          center={params.center}
        />

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

function Menu({ center }: { center: any }) {

	return (
		<div className="grid gap-4 lg:grid-cols-3 justify-center">
      <MenuItem
        title="나의 프로필"
        href={`/profile?center=${center}`}
        description="나의 프로필을 확인합니다."
      />

      <MenuItem
        title="나의 AI 에이전트 NFT"
        href={`/agent?center=${center}`}
        description="나의 AI 에이전트 NFT를 확인합니다."
      />

      {/*
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
      */}

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




export default function Home() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <HomeContent />
      </Suspense>
  );
}