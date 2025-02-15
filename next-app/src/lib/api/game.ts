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


  if (latestData
    //&& latestData.status === "opened"
  ) {


    if (latestData.status === "opened") {
      return {
        status: "success",
        data: latestData
      };
    }


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

    } else {

      // sequence is last sequence + 1

      const sequence = latestData.sequence + 1;

      const result = await collection.insertOne(
        {
          walletAddress: data.walletAddress,
          sequence: sequence,
          status: "opened",
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



  }



  // insert sequence number for order by wallet address

  /*
  const sequence = await collection.countDocuments(
    {
      walletAddress: data.walletAddress
    }
  );
  */

  // if no data, then sequence is 1
  // if data exists, then sequence is sequence + 1

  let sequence = 1;

  const findSequence = await collection.find(
    {
      walletAddress: data.walletAddress
    }
  ).sort({ sequence: -1 }).limit(1).toArray();

  if (findSequence.length > 0) {
    sequence = findSequence[0].sequence + 1;
  }



  const result = await collection.insertOne(
    {
      walletAddress: data.walletAddress,
      sequence: sequence,
      status: "opened",
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


  if (findResult.status === "closed") {
    return {
      status: "fail",
      data: findResult,
    }
  }


  const settlement = Number(Math.random() * (0.1 - 0.00001) + 0.00001).toFixed(6);

  let result = null;
  
  
  if (win) {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",
          selectedOddOrEven: selectedOddOrEven,
          resultOddOrEven: resultOddOrEven,
          win: win,
          settlementStatus: false,
          settlement: settlement,
          settlementAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    );
  } else {
    result = await collection.updateOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      },
      {
        $set: {
          status: "closed",
          selectedOddOrEven: selectedOddOrEven,
          resultOddOrEven: resultOddOrEven,
          win: win,
          updatedAt: new Date().toISOString(),
        }
      }
    );
  }





  if (result) {


    // find updated data
    const updatedData = await collection.findOne(
      {
        walletAddress: walletAddress,
        sequence: parseInt(sequence),
      }
    );

    return {
      status: "success",
      data: updatedData
    };
    ;
  } else {
    return {
      status: "fail",
      message: "fail to update"
    };
  }

}



// getAllWinGames
export async function getAllWinGames() {
  const client = await clientPromise;
  const collection = client.db('shinemywinter').collection('games');

  const result = await collection.find(
    {
      win: true
    }
  ).toArray();

  return result;
}


// getAllGamesSettlement
export async function getAllGamesSettlement() {
  const client = await clientPromise;
  const collection = client.db('shinemywinter').collection('games');

  const result = await collection.find(
    {
      settlementStatus: false,
    }
  ).toArray();

  return result;
}


// setGaemsSettlementByWalletAddressAndSequence
export async function setGamesSettlementByWalletAddressAndSequence(
  {
    walletAddress,
    sequence,
  } : {
    walletAddress: string,
    sequence: string,
  }
) {

  const client = await clientPromise;
  const collection = client.db('shinemywinter').collection('games');

  // finde one and updaate
  // sequence is integer

  const findResult = await collection.findOneAndUpdate(
    {
      walletAddress: walletAddress,
      sequence: parseInt(sequence),
    },
    {
      $set: {
        settlementStatus: true,
        settlementAt: new Date().toISOString(),
      }
    }
  );

  return findResult;
}
