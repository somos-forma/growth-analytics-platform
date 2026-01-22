import { type NextRequest, NextResponse } from "next/server";

type Parameters = {
  request: NextRequest;
  params?: Promise<{ id: string }>;
};

export async function POST({ request }: Parameters) {
  const URL = "https://auton8n.moovmediagroup.com/webhook/growth/clients";
  try {
    const body = await request.json();

    const response = await fetch(`${URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ID token" }, { status: 500 });
  }
}
