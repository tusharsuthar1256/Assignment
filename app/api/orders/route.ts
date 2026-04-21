import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  wallets,
  orders,
  acquireLock,
  releaseLock,
  generateId,
} from "@/app/lib/store";

export async function POST(req: NextRequest) {
  const client_id = req.headers.get("client-id") as string;
  const { amount } = await req.json();

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

    // Deduct
    wallets[client_id] -= amount;

    const order_id = generateId();

    const order = {
      order_id,
      client_id,
      amount,
      status: "pending",
      fulfillment_id: null,
    };

    orders[order_id] = order;

    // Fulfillment API
    const res = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        userId: client_id,
        title: order_id,
      }
    );

    order.fulfillment_id = res.data.id;
    order.status = "completed";

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Order failed" },
      { status: 500 }
    );
  } finally {
    releaseLock(client_id);
  }
}