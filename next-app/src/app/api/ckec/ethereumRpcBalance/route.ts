import { NextRequest, NextResponse } from "next/server";


  /*
  The CORS issue occurs because the server at https://shinemywinter.vercel.app/api/ckec/ethereum-rpc does not include the Access-Control-Allow-Origin header in its response.
  */




export async function GET(request: NextRequest) {

  // get parameters from the request
  const address = request.nextUrl.searchParams.get('address') || "";





  /*
  const body = await request.json();

  console.log("body", body);
  */

  const body = JSON.stringify({
    method: "eth_getBalance",
    params: [
      address,
      "latest",
    ],
    id: 1,
    jsonrpc: "2.0",
  });
  console.log("body", body);


  
       //     curl http://52.78.186.199:8080 \
       //   -X POST \
       //   -H "Content-Type: application/json" \
       //   --data '{"method":"eth_getBalance","params":["0x22571950F07e5acb92160E133B3878267c86aF56", "latest"],"id":1,"jsonrpc":"2.0"}'
  
  

  const url = "http://52.78.186.199:8080";


  try {

    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const json = await result.json();
    console.log("json", json);

    
    if (!result.ok) {
      throw new Error(json.error.message);
    }

    return NextResponse.json({
      result: json,
    });

  } catch (err) {
    console.log("err", err);
    return NextResponse.json({
      error: err,
    });
  }

  
}
