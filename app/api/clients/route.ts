import { type NextRequest, NextResponse } from "next/server";

type RouteHandler = (request: NextRequest, context?: { params: Promise<{ id: string }> }) => Promise<Response>;

export const POST: RouteHandler = async (request) => {
  const URL = "https://auton8n.moovmediagroup.com/webhook/growth/clients";
  try {
    const body = await request.json();

    const response = await fetch(`${URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ID token" }, { status: 500 });
  }
};
