import { NextResponse } from "next/server";
import type { RouteHandler } from "../../types/api.types";

export const POST: RouteHandler = async (request, context) => {
  const URL = "https://auton8n.moovmediagroup.com/webhook/218528bf-1376-4ce8-aa5c-350cb910abd5";
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(`${URL}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(body);
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ID token" }, { status: 500 });
  }
};
