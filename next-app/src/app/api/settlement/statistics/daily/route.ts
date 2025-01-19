import { NextResponse, type NextRequest } from "next/server";



import {
    getStatisticsDailyTradingVolume,
    getStatisticsDailyTradingAccountBalance,
} from '@lib/api/agent';


export async function POST(request: NextRequest) {

    const body = await request.json();



    const tradingVolume = await getStatisticsDailyTradingVolume();

    const tradingAccountBalance = await getStatisticsDailyTradingAccountBalance();




    return NextResponse.json({

        tradingVolume,
        tradingAccountBalance

    });

}
