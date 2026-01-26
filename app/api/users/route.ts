import { NextResponse } from "next/server";
import type { RouteHandler } from "../types/api.types";

export const POST: RouteHandler = async (request) => {
  const URL = "https://auton8n.moovmediagroup.com/webhook/growth/users";
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
};
