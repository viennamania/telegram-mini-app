'use client';
import React, { useEffect, useState, Suspense } from "react";

import { toast } from 'react-toastify';


import {
    getContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { deployERC721Contract } from 'thirdweb/deploys';

import {
    getOwnedNFTs,
    mintTo,
    transferFrom,
} from "thirdweb/extensions/erc721";


import {
    polygon,
    arbitrum,
    ethereum,
} from "thirdweb/chains";

import {
    ConnectButton,
    useActiveAccount,
    useActiveWallet,

    useConnectedWallets,
    useSetActiveWallet,

    AutoConnect,

} from "thirdweb/react";

import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";

import Link from "next/link";

import { smartWallet, inAppWallet } from "thirdweb/wallets";


import Image from 'next/image';

//import Uploader from '@/components/uploader';

import { balanceOf } from "thirdweb/extensions/erc20";


import {
	accountAbstraction,
	client,
    wallet,
	editionDropContract,
	editionDropTokenId,
} from "../constants";

import {
    useRouter,
    useSearchParams,
} from "next//navigation";


const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon



function AgentPage() {

    const searchParams = useSearchParams();

    const center = searchParams.get('center');

    /*
    const [params, setParams] = useState({ center: '' });

  
    useEffect(() => {
        const center = searchParams.get('center') || '';
        setParams({ center });
    }, [searchParams]);
    */
 

    const account = useActiveAccount();


    const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
    });
    

    const router = useRouter();


    const address = account?.address;
  
    // test address
    //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
  






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


    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [editedNickname, setEditedNickname] = useState("");


    const [userCode, setUserCode] = useState("");



    const [masterBot, setMasterBot] = useState({} as any);


    //console.log("address", address);

    const [loadingUserData, setLoadingUserData] = useState(false);
    const [isLoadingUserDataError, setIsLoadingUserDataError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            if (!address) {
                return;
            }

            setLoadingUserData(true);

            const response = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching user");

                setIsLoadingUserDataError(true);

                setLoadingUserData(false);
                return;
            }

            const data = await response.json();

            //console.log("data", data);


            if (data.result) {
                setNickname(data.result.nickname);
                setUserCode(data.result.id);

                setMasterBot(data.result.masterBot);

            }

            setLoadingUserData(false);
        };

        fetchData();
    }, [address]);






    /*
        settlements

        {
        "applicationId": 945194,
        "timestamp": "2025-01-15T00:32:31.295Z",
        "settlementClaim": {
            "settlementTradingVolume": 23432.23
            "totalSettlementTradingVolume": 23432.23
            "okxUid": "650230456906336098",
            "masterInsentive": "2.69895320",
            "masterWalletAddress": "0xfD6c58c58029212a5f181EA324cBC6051c7161EF",
        }
        }
      */





    const [myAgent, setMyAgent] = useState({} as any);
    const [myAgentNFT, setMyAgentNFT] = useState({} as any);

    const [loadingMyAgent, setLoadingMyAgent] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoadingMyAgent(true);
            const response = await fetch("/api/agent/getMyAgent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching my agent");
                setLoadingMyAgent(false);
                return;
            }

            const data = await response.json();

            ////console.log("getMyAgent data=========", data);

            if (data.result) {

                setMyAgent(data.result);


                const erc721ContractAddress = data.result.agentBot;
                const tokenId = data.result.agentBotNumber;

                const fetchedNFT = await fetch("/api/agent/getAgentNFTByContractAddressAndTokenId", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        erc721ContractAddress: erc721ContractAddress,
                        tokenId: tokenId,
                    }),
                });

                if (!fetchedNFT.ok) {
                    console.error("Error fetching NFT");
                    setLoadingMyAgent(false);
                    return;
                }


                const nftData = await fetchedNFT.json();

                setMyAgentNFT(nftData.result);

                
            }

            setLoadingMyAgent(false);


        };

        address && fetchData();

    } , [address]);




    // getSettlementHistoryByMasterWalletAddress
    const [settlementHistory, setSettlementHistory] = useState([] as any[]);
    const [loadingSettlementHistory, setLoadingSettlementHistory] = useState(false);
    const getSettlementHistory = async () => {
        
        setLoadingSettlementHistory(true);

        const response = await fetch("/api/agent/getSettlementHistoryByMasterWalletAddress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                limit: 10,
                page: 1,
                walletAddress: address,
            }),
        });

        if (!response.ok) {
            console.error("Error fetching settlement history");
            setLoadingSettlementHistory(false);
            return;
        }

        const data = await response.json();

        console.log("data", data);

        if (data.settlements) {
            setSettlementHistory(data.settlements);
        } else {
            setSettlementHistory([]);
        }

        setLoadingSettlementHistory(false);

    }

    useEffect(() => {
        address && getSettlementHistory();
    } , [address]);





    return (

        <main
            className="p-4 pb-28 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto"
            style={{
                backgroundImage: "url('/mobile-background-nft.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
        >

            <div className="py-0 w-full">
        
                
                <AutoConnect
                    client={client}
                    wallets={[wallet]}
                    timeout={15000}
                />

                {/* history back */}
                {/* sticky top-0 bg-white */}
                <div className='
                    sticky top-0 bg-black bg-opacity-50 z-50
                    flex flex-row items-center justify-between gap-4
                    p-4
                    w-full
                '>
                    <button
                        onClick={() => router.back()}
                        className="flex flex-row items-center gap-2 bg-gray-500 text-white p-2 rounded-lg
                        hover:bg-gray-600
                        "
                    >
                        <Image
                        src="/icon-back.png"
                        width={24}
                        height={24}
                        alt="Back"
                        />
                        <span className='text-sm text-white'>
                        뒤로가기
                        </span>
                    </button>
                </div>
                


                <div className="mt-5 flex flex-col items-start justify-center space-y-4">

                    <div className='flex flex-row items-center gap-4'>
                        
                        <Image
                            src="/logo-masterbot.png"
                            alt="Master Bot"
                            width={100}
                            height={40}
                        />
                        <span className="text-lg font-semibold text-gray-800">
                            보상내역
                        </span>
                    </div>

                    
                    <div className="flex justify-center mt-5">
                        {address ? (
                            <div className="flex flex-row gap-2 items-center justify-between">
                                
                                <Button
                                    onClick={() => (window as any).Telegram.WebApp.openLink(`https://polygonscan.com/address/${address}`)}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    내 지갑주소: {shortenAddress(address)}
                                </Button>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(address);
                                        alert('지갑주소가 복사되었습니다.');
                                    }}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    복사
                                </Button>
                                
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-400">
                                연결된 지갑이 없습니다. 지갑을 연결해 주세요.
                            </p>
                        )}      
                    </div>


                    {address && userCode && nickname && (
                        <div className='flex flex-row items-center gap-2'>
                            {/* dot */}
                            <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                            <span className='text-sm font-semibold text-zinc-800'>
                                회원아이디
                            </span>
                            <span className='text-2xl font-semibold text-blue-500'>
                                {nickname}
                            </span>
                        </div>
                    ) }

                    {address
                    && !loadingUserData && !isLoadingUserDataError
                    && !userCode && !nickname && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between'>
                            <span className='text-lg font-semibold text-red-500'>
                                닉네임이 없습니다. 닉네임을 만들어 주세요.
                            </span>

                        </div>
                    )}

                    {address && !loadingUserData && !myAgent?.masterBotInfo && (

                        <div className='w-full flex flex-col gap-2 items-start justify-between'>
                            <span className='text-lg font-semibold text-gray-500'>
                                마스트봇이 없습니다.
                            </span>
                            <span className='text-lg font-semibold text-gray-500'>
                                마스트봇을 만들어 주세요.
                            </span>
                            {/* goto button for /tbot */}
                            <button
                                onClick={() => {
                                    router.push(
                                        '/tbot'
                                    );
                                }}
                                className='w-full bg-blue-500 text-white p-4 rounded-lg'
                            >
                                마스트봇 만들로 가기
                            </button>
                        </div>
                    )}


                    {/* masterBot */}
                    {address && myAgent?.masterBotInfo ? (

                        <div className='w-full flex flex-col xl:flex-row gap-2 items-start justify-between'>
                            <div className='flex flex-col gap-2
                                border border-gray-300 p-4 rounded-lg
                            '>
                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src="/logo-opensea.png"
                                        alt="OpenSea"
                                        width={20}
                                        height={20}
                                    />
                                    <span className='text-sm font-semibold text-blue-500'>
                                        Master Bot NFT
                                    </span>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src={myAgent?.masterBotInfo?.imageUrl || "/logo-masterbot100.png"}
                                        alt="Master Bot"
                                        width={500}
                                        height={500}
                                        className='animate-pulse w-full rounded-lg'
                                    />

                                </div>
                            </div>

                            {/* 보상 내역 table view designed */}
                            {/* getSettlementHistory */}
                            {/* 지급시간, 정산채굴량, 보상(USDT) */}

                            {/* 거래량: if totalSettlementTradingVolume not exist, then use settlementTradingVolume */}

                            <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                <div className='w-full flex flex-row items-center gap-2'>
                                    <span className='text-lg font-semibold text-gray-500'>
                                        최신 보상 내역 (최근 10개)
                                    </span>
                                </div>

                                {loadingSettlementHistory ? (
                                    <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                        <span className='text-lg font-semibold text-gray-500'>
                                            Loading...
                                        </span>
                                    </div>
                                ) : (
                                    <table
                                        className='w-full border border-gray-300'
                                    >
                                        <thead>
                                            <tr>


                                                <th className='border border-gray-300 p-2 text-sm'>
                                                    보상금액(USDT)
                                                </th>
                                                <th className='border border-gray-300 p-2 text-sm'>
                                                    정산채굴량
                                                </th>
                                                <th className='border border-gray-300 p-2 text-sm'>
                                                    지급시간
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                      


                                            {settlementHistory.map((settlement: any, index: number) => (
                                                <tr key={index}>

                                                    <td
                                                        className='border border-gray-300 p-2 text-4xl text-right text-blue-500 font-semibold'
                                                        style={{
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {
                                                        Number(settlement.settlementClaim.masterInsentive).toFixed(6)
                                                        }
                                                    </td>

                                                    <td className='border border-gray-300 p-2 text-sm text-right'>
                                                        {
                                                        settlement.settlementClaim.totalSettlementTradingVolume
                                                        ? Number(settlement.settlementClaim.totalSettlementTradingVolume).toFixed(0)
                                                        : Number(settlement.settlementClaim.settlementTradingVolume).toFixed(0)
                                                        }
                                                    </td>


                                                    <td className='border border-gray-300 p-2 text-sm'>
                                                        {
                                                            (
                                                                new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 ? "방금 전" : (
                                                                    (
                                                                        new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 ? 
                                                                        Math.floor(
                                                                            (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60
                                                                        ) + "분 전" : (
                                                                            (
                                                                                new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 * 24 ? 
                                                                                Math.floor(
                                                                                    (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60
                                                                                ) + "시간 전" : (
                                                                                    (
                                                                                        new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 * 24 * 7 ? 
                                                                                        Math.floor(
                                                                                            (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60 / 24
                                                                                        ) + "일 전" : (
                                                                                            (
                                                                                                new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 * 24 * 30 ? 
                                                                                                Math.floor(
                                                                                                    (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60 / 24 / 7
                                                                                                ) + "주 전" : (
                                                                                                    (
                                                                                                        new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 * 24 * 30 * 12 ? 
                                                                                                        Math.floor(
                                                                                                            (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60 / 24 / 30
                                                                                                        ) + "달 전" : (
                                                                                                            Math.floor(
                                                                                                                (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60 / 24 / 30 / 12
                                                                                                            ) + "년 전"
                                                                                                        )
                                                                                                    )
                                                                                                )
                                                                                            )
                                                                                        )
                                                                                    )
                                                                                )
                                                                            )
                                                                        )
                                                                    )

                                                                )

                                                            )

                                                        }


                                                    {/*
                                                    


                                                        (
                                                            new Date().getTime() - settlement.timestamp
                                                        ) < 60000 ? "방금 전" : (
                                                            (
                                                                new Date().getTime() - settlement.timestamp
                                                            ) < 3600000 ? 
                                                            Math.floor(
                                                                (new Date().getTime() - settlement.timestamp) / 60000
                                                            ) + "분 전" : (
                                                                (
                                                                    new Date().getTime() - settlement.timestamp
                                                                ) < 86400000 ? 
                                                                Math.floor(
                                                                    (new Date().getTime() - settlement.timestamp) / 3600000
                                                                ) + "시간 전" : (
                                                                    (
                                                                        new Date().getTime() - settlement.timestamp
                                                                    ) < 604800000 ? 
                                                                    Math.floor(
                                                                        (new Date().getTime() - settlement.timestamp) / 86400000
                                                                    ) + "일 전" : (
                                                                        (
                                                                            new Date().getTime() - settlement.timestamp
                                                                        ) < 2592000000 ? 
                                                                        Math.floor(
                                                                            (new Date().getTime() - settlement.timestamp) / 604800000
                                                                        ) + "주 전" : (
                                                                            (
                                                                                new Date().getTime() - settlement.timestamp
                                                                            ) < 31536000000 ? 
                                                                            Math.floor(
                                                                                (new Date().getTime() - settlement.timestamp) / 2592000000
                                                                            ) + "달 전" : (
                                                                                Math.floor(
                                                                                    (new Date().getTime() - settlement.timestamp) / 31536000000
                                                                                ) + "년 전"
                                                                            )
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )


                                                    */}

                                                    </td>



                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                            </div>





                        </div>
                    ) : (
     
                        <div className='w-full flex flex-col xl:flex-row items-center justify-between gap-2'>

                        </div>

                    )}




                </div>


                {/* select agent */}



            </div>

        </main>

    );

}

          




function Header(
    {
        center,
        agent,
        tokenId,
    } : {
        center: string
        agent: string
        tokenId: string
    }
) {

    const router = useRouter();
  
  
    return (
      <header className="flex flex-col items-center mb-5 md:mb-10">
  
        {/* header menu */}
        <div className="w-full flex flex-row justify-between items-center gap-2
          bg-green-500 p-4 rounded-lg mb-5
        ">
            {/* logo */}
            <button
                onClick={() => {
                    router.push(
                        '/kr/polygon/?agent=' + agent + '&tokenId=' + tokenId + '&center=' + center
                    );
                }}
            >            
                <div className="flex flex-row gap-2 items-center">
                    <Image
                    src="/logo-marketing-center.webp"
                    alt="Circle Logo"
                    width={35}
                    height={35}
                    className="rounded-full w-10 h-10 xl:w-14 xl:h-14"
                    />
                    <span className="text-lg xl:text-3xl text-gray-800 font-semibold">
                        OWIN
                    </span>
                </div>
            </button>


            <div className="flex flex-row gap-2 items-center">

            </div>

        </div>
        
      </header>
    );
  }




    export default function Agent() {
      return (
          <Suspense fallback={<div>Loading...</div>}>
              <AgentPage />
          </Suspense>
      );
    }