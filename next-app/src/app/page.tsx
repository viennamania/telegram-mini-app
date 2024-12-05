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

import {
  polygon,
  arbitrum,
  ethereum,
} from "thirdweb/chains";

import {
  getContract,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 



const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon


function HomeContent() {

  const searchParams = useSearchParams();

  
  const [params, setParams] = useState({ center: '' });

  
  useEffect(() => {
      const center = searchParams.get('center') || '';
      setParams({ center });
  }, [searchParams]);


  
  const account = useActiveAccount();

  const contract = getContract({
    client,
    chain: polygon,
    address: contractAddress,
  });



  const address = account?.address;


  const [balance, setBalance] = useState(0);
  useEffect(() => {

    // get the balance
    const getBalance = async () => {

      if (!address) {
          return;
      }

      ///console.log('getBalance address', address);

      
      const result = await balanceOf({
        contract,
        address: address,
      });

  
      //console.log(result);

      if (!result) return;
  
      setBalance( Number(result) / 10 ** 6 );

    };

    if (address) getBalance();

    const interval = setInterval(() => {
      if (address) getBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, contract]);



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
                  center: params.center,
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

      account && params.center && fetchData();

  }, [account, params.center]);



  
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



        <div className='mb-10 w-full flex flex-col gap-4 items-start justify-center'>


          {address && (

              <div className='w-full flex flex-col gap-4 items-start justify-center'>

                  <div className='w-full flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>
                  
                      <div className=" flex flex-col xl:flex-row items-center justify-start gap-5">
                          <Image
                          src="/icon-wallet-live.gif"
                          alt="Wallet"
                          width={65}
                          height={25}
                          className="rounded"
                          />

                      </div>
                      
                      <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                          내 자산
                      </div>
                      <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                          {
                              Number(balance).toFixed(2)
                          } USDT
                      </div>
                  </div>

                  {/* send USDT */}
                  {/*
                  <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                      <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                          {Send_USDT}
                      </div>
                      <div className='flex flex-col xl:flex-row gap-2 items-start justify-between'>
                          <input
                              className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                              placeholder="0.00"
                              type='number'
                              onChange={(e) => {
                                  setAmount(Number(e.target.value));
                              }}
                          />
                          <input
                              className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                              placeholder="받는 사람 지갑주소"
                              type='text'
                              onChange={(e) => {
                                  setRecipient({
                                      ...recipient,
                                      walletAddress: e.target.value,
                                  });
                              }}
                          />
                          <button
                              disabled={sending}
                              onClick={() => {
                                  sendUsdt();
                              }}
                              className={`p-2 bg-blue-500 text-zinc-100 rounded ${sending ? 'opacity-50' : ''}`}
                          >
                              <div className='flex flex-row gap-2 items-center justify-between'>
                                  {sending && (
                                      <Image
                                          src="/loading.png"
                                          alt="Send"
                                          width={25}
                                          height={25}
                                          className="animate-spin"
                                      />
                                  )}
                                  <span className='text-lg font-semibold'>
                                      {Pay_USDT}
                                  </span>
                              </div>
                          </button>
                      </div>
                  </div>
                  */}

                  {/* wallet address and copy button */}
                  {/*
                  <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
                      <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                          입금용 지갑주소(Polygon)
                      </div>
                      <div className='flex flex-row gap-2 items-center justify-between'>
                          <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                              {address.substring(0, 6)}...{address.substring(address.length - 4, address.length)}
                          </div>
                          <button
                              onClick={() => {
                                  navigator.clipboard.writeText(address);
                                  
                                  //toast.success('지갑주소가 복사되었습니다');

                              }}
                              className="p-2 bg-blue-500 text-zinc-100 rounded"
                          >
                              Copy
                          </button>
                      </div>
                  </div>
                  */}


              </div>

          )}

        </div>









        {account && !userCenter && (
          <MenuItem
            title="나의 프로필 설정"
            href={`/profile?center=${params.center}`}
            description="나의 프로필을 설정합니다."
          />
        )}


        {/* 나의 소속 센터 */}
        {account && userCenter && (
          <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
              <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                  나의 소속 센터
              </div>
              <div className='flex flex-row gap-2 items-center justify-between'>
                  <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                      {userCenter}
                  </div>
              </div>
          </div>
        )}


        {account && userCenter && params.center !== userCenter && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-zinc-800">
              접근 권한이 없습니다.
            </p>
            {/* goto "https://t.me/" + userCenter */}
            <Button
              onClick={() => (window as any).Telegram.WebApp.openLink(`https://t.me/${userCenter}`)}
              className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              {userCenter} 센터로 이동
            </Button>
          </div>

        )}

        {account && userCenter && params.center === userCenter && (

          <Menu
            center={params.center}
          />

        )}

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