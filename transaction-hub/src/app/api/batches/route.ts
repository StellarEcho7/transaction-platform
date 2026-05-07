import { NextRequest, NextResponse } from "next/server";
import { config } from "@/src/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactions, batchName } = body;

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: "Invalid request", message: "Transactions array is required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${config.serviceUrl}/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactions,
        batchName: batchName || undefined,
        source: "MANUAL",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to create batch", message: data.message },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to connect to transaction service" },
      { status: 500 },
    );
  }
}