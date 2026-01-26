import { NextResponse } from "next/server";
import type { RouteHandler } from "../../types/api.types";

export const PUT: RouteHandler = async (request, context) => {
  const URL = "https://auton8n.moovmediagroup.com/webhook/31e5ab5d-d54b-40ed-a59c-7d107521920d/clients";
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ID token" }, { status: 500 });
  }
};
