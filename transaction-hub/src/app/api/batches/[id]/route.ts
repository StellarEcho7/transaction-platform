import { NextRequest, NextResponse } from "next/server";
import { config } from "@/src/config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const response = await fetch(`${config.serviceUrl}/batches/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error || "Failed to fetch batch",
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
