import { NextResponse } from "next/server";
import type { RouteHandler } from "../../types/api.types";

export const PATCH: RouteHandler = async (request, context) => {
  const URL = "https://auton8n.moovmediagroup.com/webhook/c9bf137f-2890-447a-bf19-808b9cfda233";
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(`${URL}/${id}`, {
      method: "PATCH",
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
