import { NextRequest, NextResponse } from "next/server";
import { wallets, ledger } from "@/app/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { client_id, amount } = await req.json();

    if (!client_id || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    wallets[client_id] = (wallets[client_id] || 0) + amount;

    ledger.push({
      client_id,
      amount,
      type: "credit",
      date: new Date(),
    });

    return NextResponse.json({ balance: wallets[client_id] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}