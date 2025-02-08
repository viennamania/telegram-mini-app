'use client';
import React, { useEffect, useState, Suspense } from "react";

import { toast } from 'react-toastify';


import {
    getContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { deployERC721Contract } from 'thirdweb/deploys';

/*
import {
    getOwnedNFTs,
    mintTo,
    transferFrom,
} from "thirdweb/extensions/erc721";
*/
// erc1155
import {
    safeTransferFrom,
    claimTo,
    getOwnedNFTs,
} from "thirdweb/extensions/erc1155";



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

import {
    allowance,
    approve,
    balanceOf
} from "thirdweb/extensions/erc20";


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
import { token } from "thirdweb/extensions/vote";


const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon


function AgentPage() {

    const searchParams = useSearchParams();

    const center = searchParams.get('center');


    const tokenId = searchParams.get('tokenId');
 

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


    ///console.log("balance", balance);



    
    const [nickname, setNickname] = useState("");
    const [editedNickname, setEditedNickname] = useState("");

    const [avatar, setAvatar] = useState("/profile-default.png");



    

    const [userCode, setUserCode] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);



    const [avatarEdit, setAvatarEdit] = useState(false);



    const [seller, setSeller] = useState(null) as any;


    const [isAgent, setIsAgent] = useState(false);

    const [referralCode, setReferralCode] = useState("");

    const [erc721ContractAddress, setErc721ContractAddress] = useState("");

    const [userCenter, setUserCenter] = useState("");

    const [isCenterOwner, setIsCenterOwner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    center: center,
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

                setIsCenterOwner(
                    data.result.centerOwner === true
                );

            } else {
                setNickname('');
                setAvatar('/profile-default.png');
                setUserCode('');
                setSeller(null);
                setEditedNickname('');
                
                //setAccountHolder('');

                //setAccountNumber('');
                //setBankName('');

                setIsAgent(false);

                setReferralCode('');

                setErc721ContractAddress('');

                setUserCenter('');
            }

        };

        address && center &&
        fetchData();

    }, [address, center]);
    



    // check user nickname duplicate


    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);

    const checkNicknameIsDuplicate = async ( nickname: string ) => {

        const response = await fetch("/api/user/checkUserByNickname", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nickname: nickname,
            }),
        });


        const data = await response?.json();


        //console.log("checkNicknameIsDuplicate data", data);

        if (data.result) {
            setIsNicknameDuplicate(true);
        } else {
            setIsNicknameDuplicate(false);
        }

    }




    const [loadingSetUserData, setLoadingSetUserData] = useState(false);

    const setUserData = async () => {


        // check nickname length and alphanumeric
        //if (nickname.length < 5 || nickname.length > 10) {

        if (editedNickname.length < 5 || editedNickname.length > 10) {

            //toast.error("닉네임은 5자 이상 10자 이하로 입력해주세요");
            return;
        }
        
        ///if (!/^[a-z0-9]*$/.test(nickname)) {
        if (!/^[a-z0-9]*$/.test(editedNickname)) {
            //toast.error("닉네임은 영문 소문자와 숫자만 입력해주세요");
            return;
        }


        setLoadingSetUserData(true);

        if (nicknameEdit) {


            const response = await fetch("/api/user/updateUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    
                    //nickname: nickname,
                    nickname: editedNickname,

                }),
            });

            const data = await response.json();

            ///console.log("updateUser data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                //toast.success('Nickname saved');

            } else {

                //toast.error('You must enter different nickname');
            }


        } else {

            const response = await fetch("/api/user/setUserVerified", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,                    
                    //nickname: nickname,
                    nickname: editedNickname,
                    userType: "",
                    mobile: "",
                    telegramId: "",
                }),
            });

            const data = await response.json();

            //console.log("data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                //toast.success('Nickname saved');

            } else {
                //toast.error('Error saving nickname');
            }
        }

        setLoadingSetUserData(false);

        
    }




    const erc1155ContractAddress = "0xE6BeA856Cd054945cE7A9252B2dc360703841028";



    // claim NFT
    const [claimingNft, setClaimingNft] = useState(false);
    const [messageClaimingNft, setMessageClaimingNft] = useState("");
    const claimNft = async (contractAddress: string, tokenId: string) => {

        if (claimingNft) {
            //toast.error('이미 실행중입니다');
            setMessageClaimingNft('이미 실행중입니다');
            return;
        }

        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            setMessageClaimingNft('지갑을 먼저 연결해주세요');
            return;
        }

        if (confirm("NFT를 발행하시겠습니까?") === false) {
            return;
        }

        setMessageClaimingNft('NFT 발행중입니다');

        setClaimingNft(true);

        try {

            const erc1155Contract = getContract({
                client,
                chain: polygon,
                address: contractAddress,
            });


            // // ERC20: transfer amount exceeds allowance

            const result =
            await allowance({
                contract: contract,
                owner: address as string,
                spender: erc1155ContractAddress,
            });

            console.log("result", result);

            if (result < 1) {
                
                //throw new Error('USDT 토큰을 먼저 교환권 NFT 발행 계약에 승인해주세요');

                // approve

                const transactionApprove = approve({
                    contract: contract,
                    spender: erc1155ContractAddress,
                    amount: 1,
                });

                const transactionResultApprove = await sendAndConfirmTransaction({
                    account: account as any,
                    transaction: transactionApprove,
                });

                if (!transactionResultApprove) {
                    throw new Error('USDT 토큰을 먼저 교환권 NFT 발행 계약에 승인해주세요');
                }

            }



            const transaction = claimTo({
                contract: erc1155Contract,


                //tokenId: BigInt(tokenId),

                tokenId: 0n,


                to: address as string,
                ///amount: 1n,

                quantity: 1n,

            });

            const transactionResult = await sendAndConfirmTransaction({
                account: account as any,
                transaction: transaction,
            });

            if (!transactionResult) {
                throw new Error('NFT 발행 실패. 관리자에게 문의해주세요');
            }

            setMessageClaimingNft('NFT 발행 완료');

            alert('NFT 발행 완료');

            /*
            // fetch the NFTs again
            const response = await fetch("/api/nftNoah/getNFTByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tokenId: tokenId,
                    walletAddress: address,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.result) {
                    setMyNfts(data.result.ownedNfts);
                } else {
                    setMyNfts([]);
                }
            }
            */


        } catch (error) {

            if (error instanceof Error) {
                setMessageClaimingNft('NFT 발행 실패:' + error.message);

                alert('NFT 발행 실패:' + error.message);

                // ERC20: transfer amount exceeds allowance

            } else {
                setMessageClaimingNft('NFT 발행 실패: 알 수 없는 오류');

                alert('NFT 발행 실패: 알 수 없는 오류');
            }
        }

        setClaimingNft(false);


    }




    // getOwnedNFTs
    //const [ownedNfts, setOwnedNfts] = useState([] as any[]);






    const [ownedNfts, setOwnedNfts] = useState([] as any[]);
    const [loadingOwnedNfts, setLoadingOwnedNfts] = useState(false);

    useEffect(() => {
        const fetchOwnedNFTs = async () => {
            setLoadingOwnedNfts(true);


            const contractErc1155 = getContract({
                client,
                chain: polygon,
                address: erc1155ContractAddress,
            });

            const nfts = await getOwnedNFTs({
                contract: contractErc1155,
                start: 0,
                count: 10,
                address: address as string,
            });
            setOwnedNfts(nfts);
            setLoadingOwnedNfts(false);
        };

        if (address) {
            fetchOwnedNFTs();
        }
    }, [address, erc1155ContractAddress]);


    //console.log("ownedNfts", ownedNfts);





    // background image

    return (

        <main

           
            className="p-4 pb-28 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto
                bg-zinc-900 bg-opacity-90 backdrop-blur-md
                rounded-lg shadow-xl"


            /*
            style={{
                backgroundImage: "url('/noah100.png')"

                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            */
            /* background image */


        >



            <div className="py-0 w-full">

                <AutoConnect
                    client={client}
                    wallets={[wallet]}
                    timeout={15000}
                />

                {/* sticky header */}
                <div className="sticky top-0 z-50
                    bg-zinc-800 bg-opacity-90
                    backdrop-blur-md
                    p-4 rounded-lg
                    w-full flex flex-row items-center justify-between">

                    {/* title */}
                    <div className="text-2xl font-semibold text-zinc-100">
                        나의 NOAH-K 교환권 NFT
                    </div>
                </div>
        
                <div className="mt-5 flex flex-col items-start justify-center space-y-4">

                    
                    
                    <div className="flex justify-center mt-5">
                        {address ? (
                            <div className="flex flex-row gap-2 items-center justify-between">

                                <div className=" flex flex-col xl:flex-row items-center justify-start gap-5">
                                    <Image
                                    src="/icon-wallet-live.gif"
                                    alt="Wallet"
                                    width={50}
                                    height={25}
                                    className="rounded"
                                    />
                                </div>

                                
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

                                {/* polygon scan */}
                                <Button
                                    onClick={() => (window as any).Telegram.WebApp.openLink(`https://polygonscan.com/address/${address}`)}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    <Image
                                        src="/logo-polygon.png"
                                        alt="Polygon"
                                        width={20}
                                        height={20}
                                        className="rounded"
                                    />
                                </Button>
                                
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-400">
                                연결된 지갑이 없습니다. 지갑을 연결해 주세요.
                            </p>
                        )}      
                    </div>


                    {/* usdt balance */}
                    {address && (
                        <div className="w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg"
                        >

                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="text-sm text-zinc-100 font-semibold">
                                    USDT 잔액
                                </div>
                            </div>
                            <span className="text-4xl text-green-500 font-semibold">
                                {
                                    balance.toLocaleString(undefined, {
                                        maximumFractionDigits: 6,
                                    })
                                }
                            </span>

                        </div>
                    )}

                




                    {/* claim NFT */}
                    {address && (
                        <div className="w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg">
                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                {/* dot */}
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="text-sm text-zinc-100 font-semibold">
                                    교환권 NFT 발행
                                </div>
                            </div>
                            <span className="text-lg text-zinc-400 font-semibold">
                                교환권 NFT를 발행받을려면 아래 버튼을 클릭하세요.
                            </span>
                            <button
                                disabled={claimingNft}
                                onClick={() => claimNft(erc1155ContractAddress, "0")}
                                className={`
                                    ${claimingNft ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                    p-2 rounded-lg text-sm font-semibold
                                `}
                            >
                                <div className="flex flex-row gap-2 items-center justify-center">
                                    {claimingNft && (
                                        <Image
                                            src="/loading.png"
                                            alt="loding"
                                            width={30}
                                            height={30}
                                            className="animate-spin"
                                        />
                                    )}
                                    {claimingNft && '교환권 NFT 발행중...'}
                                    {!claimingNft && '교환권 NFT 발행'}
                                </div>
                            </button>
                            <span className="text-lg text-zinc-400 font-semibold">
                                교환권 NFT 발행은 1 USDT 당 1개씩 발행 가능합니다.
                            </span>
                        </div>
                    )}




                    {/* if not centerOwner show message */}
                    {/* NFT를 발행받을려면 센터장에게 문의하세요. */}
                    {/*
                    {address && userCode && !isCenterOwner && (
                        <div className='w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg'>
                            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                AI 에이전트 NFT 발행
                            </div>
                            <span className='text-lg font-semibold'>
                                AI 에이전트 NFT를 발행받을려면 센터장에게 문의하세요.
                            </span>
                        </div>
                    )}
                        */}


                    {/* if centerOwner show message */}
                    {/* AI 에이전트 계약주소 생성하기 */}
                    {/*
                        address && userCode && !erc721ContractAddress && isCenterOwner && (
                    <>



                        {address && userCode && !erc721ContractAddress && (

    
                            <button
                                disabled={loadingDeployErc721Contract}
                                onClick={deployErc721Contract}
                                className={`
                                    ${loadingDeployErc721Contract ? 'bg-gray-300 text-gray-400' : 'bg-green-500 text-zinc-100'}
                                    p-2 rounded-lg text-sm font-semibold
                                `}
                            >
                                <div className='flex flex-row gap-2 items-center justify-center'>

                                    {address && loadingDeployErc721Contract && (
                                        <Image
                                            src="/loading.png"
                                            alt="loding"
                                            width={30}
                                            height={30}
                                            className='animate-spin'
                                        />
                                    )}
                                    {address && loadingDeployErc721Contract && 'AI 에이전트 계약주소 생성중...'}
                                    {address && !erc721ContractAddress && !loadingDeployErc721Contract && 'AI 에이전트 계약주소 생성하기'}
    
                                </div>

                            </button>

                        )}

                    </>
                    )*/}



                    {/* My Referral Code */}
                    {/* address */}
                    {
                        address && userCode && erc721ContractAddress && isCenterOwner && (

                        <div className='w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg'>

                            <div className='w-full flex flex-row gap-2 items-center justify-between'>
                                <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                    교환권 계약주소
                                </div>

                                <span className='text-xs xl:text-lg font-semibold'>
                                    {erc721ContractAddress.substring(0, 6) + '...' + erc721ContractAddress.substring(erc721ContractAddress.length - 4)}
                                </span>




                                {/* https://opensea.io/assets/matic/0xC1F501331E5d471230189E4A57E5268f10d0072A */}
                                {/* open new window */}
                                
                                <button
                                    onClick={() => {
                                        window.open('https://opensea.io/assets/matic/' + erc721ContractAddress);
                                    }}
                                    className="p-2 rounded hover:bg-gray-300"
                                >
                                    <Image
                                        src="/logo-opensea.png"
                                        alt="OpenSea"
                                        width={30}
                                        height={30}
                                        className="rounded-lg"
                                    />
                                </button>
                                


                                {/* verified icon */}

                                <Image
                                    src="/verified.png"
                                    alt="Verified"
                                    width={20}
                                    height={20}
                                    className="rounded-lg"
                                />


                            </div>

                            

                            {/* mint AI Agent NFT */}
                            {/*
                            <div className='w-full flex flex-col gap-2 items-start justify-between
                                bg-yellow-100 border border-gray-300
                                p-4 rounded-lg'>
                                
                                <span className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                    AI 에이전트 NFT 발행
                                </span>

                                <div className='flex flex-col xl:flex-row gap-2 items-start justify-between'>
                                    <input 
                                        className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                        placeholder="에이전트 이름"
                                        type='text'
                                        onChange={(e) => {
                                            setAgentName(e.target.value);
                                        }}
                                        value={agentName}
                                    />
                                    <input 
                                        className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                        placeholder="에이전트 설명"
                                        type='text'
                                        onChange={(e) => {
                                            setAgentDescription(e.target.value);
                                        }}
                                        value={agentDescription}
                                    />
                                </div>

                                <button
                                    disabled={mintingAgentNft}
                                    onClick={mintAgentNft}
                                    className={`
                                        ${mintingAgentNft ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-zinc-100'}
                                        p-2 rounded-sm text-sm font-semibold
                                    `}
                                >
                                    <div className='flex flex-row gap-2 items-center justify-center'>
                                       
                                        {mintingAgentNft && (
                                            <Image
                                                src="/loading.png"
                                                alt="loding"
                                                width={30}
                                                height={30}
                                                className='animate-spin'
                                            />
                                        )}
                                        {mintingAgentNft && 'AI 에이전트 NFT 발행중...'}
                                        {!mintingAgentNft && 'AI 에이전트 NFT 발행하기'}
                                    </div>
                                </button>

                                {messageMintingAgentNft && (
                                    <span className='text-lg font-semibold text-red-500
                                        border border-gray-300 p-4 rounded-lg'>
                                        {messageMintingAgentNft}
                                    </span>
                                )}

                                {ganeratingAgentImage && (
                                    <div className='flex flex-row gap-2 items-center justify-center'>
                                        <Image
                                            src="/loading.png"
                                            alt="loding"
                                            width={30}
                                            height={30}
                                            className='animate-spin'
                                        />
                                        <span className='text-xs font-semibold'>
                                            AI 에이전트 이미지 생성중...
                                        </span>
                                    </div>
                                )}

                                {agentImage && (
                                    <Image
                                        src={agentImage}
                                        alt="AI Agent"
                                        width={200}
                                        height={200}
                                        className="rounded-lg"
                                    />
                                )}

                            </div>
                            */}


                        </div>

                    )}
      

                    {/* owned NFTs */}
                    <div className="w-full flex flex-col gap-2 items-center justify-between
                        border border-gray-800
                        p-4 rounded-lg">
                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                            {/* dot */}
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="text-sm text-zinc-100 font-semibold">
                                교환권 NFT 소유
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2 items-center justify-between">
                            {ownedNfts.map((nft, index) => (
                                <div key={index} className="w-full flex flex-col gap-2 items-center justify-between
                                    border border-gray-800
                                    p-4 rounded-lg">
                                    
                                    {/* metadata?.animation_url */}
                                    {/* ipfs://QmZzvZ to https://ipfs.io/ipfs/QmZzvZ */}
                                    {/* video */}
                                    <div className="w-full flex flex-col gap-2 items-center justify-between">
                                        <video
                                            src={nft.metadata?.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                            //controls
                                            autoPlay
                                            loop
                                            className="rounded-lg"
                                        />
                                    </div>

                                    <div className="text-xl text-zinc-100 font-semibold">
                                        {nft.metadata?.name}
                                    </div>
                                    
                                    <div className="text-4xl text-green-500 font-semibold">
                                        {
                                            // nft.quantityOwned is bigint
                                            nft.quantityOwned.toString()
                                        }개
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>





                </div>

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
                    router.push('/?center=' + center + '&agent=' + agent + '&tokenId=' + tokenId);
                }}
            >            
                <div className="flex flex-row gap-2 items-center">
                    <Image
                    src="/logo-aiagent.png"
                    alt="Circle Logo"
                    width={35}
                    height={35}
                    className="rounded-full w-10 h-10 xl:w-14 xl:h-14"
                    />
                    <span className="text-lg xl:text-3xl text-gray-800 font-semibold">
                    AI Agent
                    </span>
                </div>
            </button>

            {/*}
            <div className="flex flex-row gap-2 items-center">
                <button
                onClick={() => {
                    router.push(
                        "/tbot?center=" + center + "agent=" + agent + "&tokenId=" + tokenId
                    );
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
                >
                TBOT
                </button>
                <button
                onClick={() => {
                    router.push('/profile?center=' + center + 'agent=' + agent + '&tokenId=' + tokenId);
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
                >
                SETTINGS
                </button>
            </div>
            */}


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