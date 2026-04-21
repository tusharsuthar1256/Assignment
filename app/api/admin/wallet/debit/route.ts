import { NextRequest, NextResponse } from "next/server";
import {
  wallets,
  ledger,
  acquireLock,
  releaseLock,
} from "@/app/lib/store";

export async function POST(req: NextRequest) {
  const { client_id, amount } = await req.json();

  if (!client_id || amount <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await acquireLock(client_id);

  try {
    const balance = wallets[client_id] || 0;

    if (balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    wallets[client_id] -= amount;

    ledger.push({
      client_id,
      amount,
      type: "debit",
      date: new Date(),
    });

    return NextResponse.json({ balance: wallets[client_id] });
  } finally {
    releaseLock(client_id);
  }
}