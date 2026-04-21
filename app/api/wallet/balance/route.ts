import { NextRequest, NextResponse } from "next/server";
import { wallets } from "@/app/lib/store";

export async function GET(req: NextRequest) {
  const client_id = req.headers.get("client-id");

  if (!client_id) {
    return NextResponse.json(
      { error: "Missing client-id" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    balance: wallets[client_id] || 0,
  });
}