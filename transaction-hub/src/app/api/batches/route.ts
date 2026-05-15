import { NextRequest, NextResponse } from "next/server";
import { config } from "@/src/config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status") || "";
    const name = searchParams.get("name") || "";

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if (status) {
      queryParams.append("status", status);
    }
    if (name) {
      queryParams.append("name", name);
    }

    const response = await fetch(
      `${config.serviceUrl}/batches?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error || "Failed to fetch batches",
          message: data.message,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to connect to transaction service",
      },
      { status: 500 },
    );
  }
}

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
        {
          error: data.error || "Failed to create batch",
          message: data.message,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to connect to transaction service",
      },
      { status: 500 },
    );
  }
}
