import { NextRequest, NextResponse } from "next/server";
import { orders } from "@/app/lib/store";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await context.params;

  const client_id = req.headers.get("client-id");

  const order = orders[order_id];

  if (!order || order.client_id !== client_id) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(order);
}