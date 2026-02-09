import { NextResponse } from "next/server";
import type { RouteHandler } from "../types/api.types";

export const GET: RouteHandler = async (request) => {
  const API_URL = "https://auton8n.moovmediagroup.com/webhook/mix-marketing-model";
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const client_id = searchParams.get("client_id");

    const response = await fetch(`${API_URL}?user_id=${user_id}&client_id=${client_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from external API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed endpoint GET /analysis", message: error }, { status: 500 });
  }
};

export const POST: RouteHandler = async (request) => {
  const API_URL = "https://auton8n.moovmediagroup.com/webhook/mix-marketing-model";
  console.log(request);
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed endpoint POST /analysis", message: error }, { status: 500 });
  }
};
