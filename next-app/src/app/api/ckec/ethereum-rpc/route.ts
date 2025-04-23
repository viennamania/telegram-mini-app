import { N } from "ethers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

  const body = await request.json();

  /*
  {"method":"eth_getBalance","params":["0x22571950F07e5acb92160E133B3878267c86aF56", "latest"],"id":1,"jsonrpc":"2.0"}
  */



  const {
    method,
    params,
    id,
    jsonrpc,
  } = body;


  /*
            curl http://52.78.186.199:8080 \
          -X POST \
          -H "Content-Type: application/json" \
          --data '{"method":"eth_getBalance","params":["0x22571950F07e5acb92160E133B3878267c86aF56", "latest"],"id":1,"jsonrpc":"2.0"}'
  */
  

  const url = "http://52.78.186.199:8080";

  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method,
      params,
      id,
      jsonrpc,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log("err", err);
      
      return {
        error: err,
      };
    });

    


  return NextResponse.json({
    result,
  });
  
}
