import clientPromise from '../mongodb';

// object id
import { ObjectId } from 'mongodb';


export interface GameProps {
 
}

export interface ResultProps {
  totalCount: number;
  orders: GameProps[];
}



// insertOne
export async function insertOne(data: any) {
  const client = await clientPromise;
  const collection = client.db('shinemywinter').collection('games');

  // insert sequence number for order by wallet address

  const sequence = await collection.countDocuments({ walletAddress: data.walletAddress });

  const result = await collection.insertOne(
    {
      walletAddress: data.walletAddress,
      sequence: sequence,
      usdtAmount: data.usdtAmount,
      krwAmount: data.krwAmount,
      rate: data.rate,
      createdAt: new Date().toISOString(),
    }
  );

  if (result) {
    return result;
  } else {
    return null;
  }

}



// getOneByWalletAddressAndSequence
export async function getOneByWalletAddressAndSequence(walletAddress: string, sequence: number) {
  const client = await clientPromise;
  const collection = client.db('shinemywinter').collection('games');

  const result = await collection.findOne(
    { walletAddress: walletAddress, sequence: sequence }
  );

  if (result) {
    return result;
  } else {
    return null;
  }

}

// check if createAt is within 1 minute from now
export function isWithinOneMinute(createdAt: string) {
  const now = new Date();
  const createdAtDate = new Date(createdAt);

  const diff = now.getTime() - createdAtDate.getTime();

  if (diff < 60000) {
    return true;
  } else {
    return false;
  }
}

// update result
export async function updateResultByWalletAddressAndSequence(walletAddress: string, sequence: number, data: any) {
  const client = await clientPromise;
  const collection = client.db('shinemywinter').collection('games');

  const result = await collection.updateOne(
    { walletAddress: walletAddress, sequence: sequence },
    {
      $set: {
        result: data.result,
        updatedAt: new Date().toISOString(),
      }
    }
  );

  if (result) {
    return result;
  } else {
    return null;
  }

}