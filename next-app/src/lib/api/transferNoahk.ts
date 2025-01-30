import { transfer } from 'thirdweb/extensions/erc20';
import clientPromise from '../mongodb';

/*
  console.log("transactionHash", transactionHash, "transactionIndex", transactionIndex,
    "fromAddress", fromAddress, "toAddress", toAddress, "value", value,
    "timestamp", timestamp);
  
*/

export interface TransferProps {
    transactionHash: string;
    transactionIndex: string;
    fromAddress: string;
    toAddress: string;
    value: string;
    timestamp: string;
}

export async function insertOne(data: any) {

    if (!data.transactionHash || !data.transactionIndex || !data.fromAddress || !data.toAddress || !data.value || !data.timestamp) {
        return null;
    }

    const transferData = {
        transactionHash: data.transactionHash,
        transactionIndex: data.transactionIndex,
        fromAddress: data.fromAddress,
        toAddress: data.toAddress,
        value: data.value,
        timestamp: data.timestamp,
    };


    const client = await clientPromise;

    // if fromAddress is user wallet address, then insert into userTransfers collection
    // if toAddress is user wallet address, then insert into userTransfers collection


    const collectionUsers = client.db('shinemywinter').collection('usersNoahk');



    const collectionUserTransfers = client.db('shinemywinter').collection('userTransfersNoahk');

    
    const collection = client.db('shinemywinter').collection('transfersNoahk');


    

    const user = await collectionUsers.findOne(
        { $or: [ { walletAddress: data.fromAddress }, { walletAddress: data.toAddress } ] },
        { projection: { walletAddress: 1 } }
    );

    if (!user) {
        return null;
    }
    

    const result = await collection.insertOne(transferData);

    // if error, then return
    if (!result) {
        return null;
    }


    ////const userFromAddress = await collectionUsers.findOne({ walletAddress: data.fromAddress });
    /*
    const userFromAddress = collectionUsers
    .aggregate([
        { $match: { walletAddress: data.fromAddress } },
        { $project: { _id: 1, telegramId: 1, walletAddress: 1 } }
    ])
    */


    let sendOrReceive = "send";

    const userFromAddress = await collectionUsers.findOne(
        { walletAddress: data.fromAddress },
        { projection: {
                nickname: 1,
                mobile: 1,
                telegramId: 1,
                walletAddress: 1,
                center: 1
            }
        }
    )

    if (userFromAddress) {
        
        /*
        await collectionUserTransfers.insertOne(
        {
            user: userFromAddress,
            sendOrReceive: "send",
            transferData: transferData,
        } );
        */

        sendOrReceive = "send";


    }



    const userToAddress = await collectionUsers.findOne(
        { walletAddress: data.toAddress },
        { projection: {
                nickname: 1,
                mobile: 1,
                telegramId: 1,
                walletAddress: 1,
                center: 1
            }
        }
    )

    if (userToAddress) {

        /*
        const response = await collectionUserTransfers.insertOne(
        {
            user: userToAddress,
            sendOrReceive: "receive",
            transferData: transferData,
        } );
        */
        sendOrReceive = "receive";
    }


    let response = null;

    if (sendOrReceive === "send") {

        const response = await collectionUserTransfers.insertOne(
        {
            user: userFromAddress,
            otherUser: userToAddress,

            sendOrReceive: sendOrReceive,
            transferData: transferData,
        } );


    } else if (sendOrReceive === "receive") {

        const response = await collectionUserTransfers.insertOne(
        {
            user: userToAddress,
            otherUser: userFromAddress,

            sendOrReceive: sendOrReceive,
            transferData: transferData,
        } );

        if (response ) {

    
            const walletAddress = userToAddress?.walletAddress;
            const telegramId = userToAddress?.telegramId;
            const center = userToAddress?.center;
    
            if (telegramId) {
    
                // divide by 1e18
                const amount = parseFloat(data.value) / 1e18;
    
                ///const message = "You have received " + Number(amount).toFixed(6) + " USDT";
                const message = Number(amount).toFixed(0) + " NOAH-K 포인트를 받았습니다";
    
                const collectionTelegramMessages = client.db('shinemywinter').collection('telegramMessages');
    
                await collectionTelegramMessages.insertOne(
                {
                    center: center,
                    category: "wallet",
                    walletAddress: walletAddress,
                    telegramId: telegramId,
                    message: message,
                    timestamp: data.timestamp,
                }
                );
    
            }

        }



        
    }





        


        
   




    return {
        result: "success",
    };


}




// getTransferByWalletAddress
export async function getTransferByWalletAddress(data: any) {

    if (!data.walletAddress) {
        return null;
    }


    const client = await clientPromise;

    const collectionUsers = client.db('shinemywinter').collection('usersNoahk');

    
    const user = await collectionUsers.findOne(
        { walletAddress: data.walletAddress },
        { projection: { walletAddress: 1 } }
    );


    if (!user) {
        return null;
    }

    // transferData: { transactionHash: string, transactionIndex: string, fromAddress: string, toAddress: string, value: string, timestamp: string }
    // timestamp desc
    

    const collectionUserTransfers = client.db('shinemywinter').collection('userTransfersNoahk');

    const userTransfers = await collectionUserTransfers
    .find({ "user.walletAddress": data.walletAddress })
    .sort({ "transferData.timestamp": -1 })
    .toArray();

    // totalTransfers
    const totalTransfers = await collectionUserTransfers
    .find({ "user.walletAddress": data.walletAddress })
    .count();



    return {
        transfers: userTransfers,
        totalTransfers: totalTransfers,
    }

}

