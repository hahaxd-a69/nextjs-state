import { NextResponse } from "next/server";

const baseAPI = process.env.NEXT_PUBLIC_API;
export async function GET() {
  const res = await fetch(`${baseAPI}/products`);
  const data = await res.json();

  return NextResponse.json(data);
}
export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${baseAPI}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  console.log("body", body);

  const data = await res.json();

  return NextResponse.json(data);
}
