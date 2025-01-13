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


    const collectionUsers = client.db('shinemywinter').collection('users');

    const collectionUserTransfers = client.db('shinemywinter').collection('userTransfers');

    const collection = client.db('shinemywinter').collection('transfers');



    const userFromAddress = await collectionUsers.findOne({ walletAddress: data.fromAddress });

    if (userFromAddress) {
        
        //console.log("userFromAddress", userFromAddress);


        await collectionUserTransfers.insertOne(
        {
            user: userFromAddress,
            sendOrReceive: "send",
            transferData: transferData,
        }
        );

        await collection.insertOne(
            transferData
        );

    }

    const userToAddress = await collectionUsers.findOne({ walletAddress: data.toAddress });

    if (userToAddress) {
        
        //console.log("userToAddress", userToAddress);

        await collectionUserTransfers.insertOne(
        {
            user: userToAddress,
            sendOrReceive: "receive",
            transferData: transferData,
        }
        );

        await collection.insertOne(
            transferData
        );


        const telegramId = userToAddress.telegramId;

        if (telegramId) {

            const amount = parseFloat(data.value) / 100000000;

            const collectionTelegramMessages = client.db('shinemywinter').collection('telegramMessages');

            await collectionTelegramMessages.insertOne(
            {
                category: "wallet",
                telegramId: telegramId,
                message: "You have received " + amount + " USDT",
            }
            );

        }


        
    }

 





    return {
        result: "success",
    };


}
