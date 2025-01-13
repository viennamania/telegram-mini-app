import { transfer } from 'thirdweb/extensions/erc20';
import clientPromise from '../mongodb';

/*
{
  "_id": {
    "$oid": "678463726bacbc66db602c33"
  },
  "category": "wallet",
  "telegramId": "441516803",
  "message": "You have received 0.221000 USDT"
}
  
*/

export interface Message {
    _id: {
        $oid: string;
    };
    category: string;
    telegramId: string;
    message: string;
}


// getMessagesByTelegramId
export async function getMessagesByTelegramId(data: any) {

    console.log("data", data);


    if (!data.telegramId) {
        return null;
    }



    const client = await clientPromise;

    const collectionTelegramMessages = client.db('shinemywinter').collection('telegramMessages');


    try {

        const messages = await collectionTelegramMessages
        .find({ telegramId: data.telegramId })
        .sort({ _id: -1 })
        .limit(data.limit)
        .skip(data.limit * (data.page - 1))
        .toArray();


        console.log("messages", messages);


        // totalTelegramMessages

        const totalMessages = await collectionTelegramMessages
        .find({ telegramId: data.telegramId })
        .count();


        return {
            messages,
            totalMessages,
        }


    } catch (error) {
        
        console.log("error", error+'');

        return null;

    }

}


