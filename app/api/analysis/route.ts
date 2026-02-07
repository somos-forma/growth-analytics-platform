import { NextResponse } from "next/server";
import type { RouteHandler } from "../types/api.types";

export const GET: RouteHandler = async (request) => {
  const URL = "https://auton8n.moovmediagroup.com/webhook/mix-marketing-model";
  console.log(request);
  try {
    const body = await request.json();

    const response = await fetch(`${URL}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed endpoint GET /analysis", message: error }, { status: 500 });
  }
};

export const POST: RouteHandler = async (request) => {
  const URL = "https://auton8n.moovmediagroup.com/webhook/mix-marketing-model";
  console.log(request);
  try {
    const body = await request.json();

    const response = await fetch(`${URL}`, {
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
