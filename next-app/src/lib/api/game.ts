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


  // check if latest data is within 30 seconds
  // then return waiting message

  // // within 30 seconds

  const latestData = await collection.findOne({ walletAddress: data.walletAddress }, { sort: { createdAt: -1 } });


  if (latestData) {
    // within 60 seconds
    if (
      //isWithinOneMinute(latestData.createdAt)
      new Date().getTime() - new Date(latestData.createdAt).getTime() < 60000
    ) {
  
      return {
        status: "waiting",
        waitingTime: 60 - Math.floor((new Date().getTime() - new Date(latestData.createdAt).getTime()) / 1000),
        data: latestData

      };
    }
  }



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

  const insertedId = result.insertedId;

  const insertedData = await collection.findOne({ _id: insertedId });

  if (insertedData) {
    return {
      status: "success",
      data: insertedData
    };
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
/*
    walletAddress,
    sequence,
    selectedOddOrEven,
    resultOddOrEven,
    win. true, false
    */
export async function updateResultByWalletAddressAndSequence(

  {
    walletAddress,
    sequence,
    selectedOddOrEven,
    resultOddOrEven,
    win
  } : {
    walletAddress: string,
    sequence: string,
    selectedOddOrEven: string,
    resultOddOrEven: string,
    win: boolean
  }

) {

  const client = await clientPromise;
  const collection = client.db('shinemywinter').collection('games');

  // finde one
  // sequence is integer

  const findResult = await collection.findOne(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    }
  );

  if (!findResult) {

    return {
      params : {
        walletAddress: walletAddress,
        sequence: sequence,
        selectedOddOrEven: selectedOddOrEven,
        resultOddOrEven: resultOddOrEven,
        win: win,
      },
      status: "fail",
      message: "no data found"
    }
  }

  const result = await collection.updateOne(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    },
    {
      $set: {
        selectedOddOrEven: selectedOddOrEven,
        resultOddOrEven: resultOddOrEven,
        win: win,
        updatedAt: new Date().toISOString(),
      }
    }
  );

  if (result) {
    return {
      status: "success",
      data: findResult
    };
    ;
  } else {
    return {
      status: "fail",
      message: "fail to update"
    };
  }

}