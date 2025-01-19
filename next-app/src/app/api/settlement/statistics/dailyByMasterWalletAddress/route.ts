import { NextResponse, type NextRequest } from "next/server";



import {
    getStatisticsDailyTradingVolumeByApplicationId,
    getStatisticsDailyTradingAccountBalanceByApplicationId,
} from '@lib/api/agent';


export async function POST(request: NextRequest) {

    const body = await request.json();

    const { applicationId } = body;

    if (!applicationId) {
        return NextResponse.error();
    }


    const tradingVolume = await getStatisticsDailyTradingVolumeByApplicationId(applicationId);

    const tradingAccountBalance = await getStatisticsDailyTradingAccountBalanceByApplicationId(applicationId);




    return NextResponse.json({

        tradingVolume,
        tradingAccountBalance

    });

}
