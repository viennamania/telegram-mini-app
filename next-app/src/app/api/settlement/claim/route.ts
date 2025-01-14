import { NextResponse, type NextRequest } from "next/server";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { applicationgId } = body;

  // call https://owinwallet.com/api/settlement/claim

  const result = await fetch("https://owinwallet.com/api/settlement/claim", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicationgId,
    }),
  })

  if (!result.ok) {
    return NextResponse.error();
  }

  const data = await result.json();

  return NextResponse.json({
    data,
  });

}
  