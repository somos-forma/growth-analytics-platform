import { type NextRequest, NextResponse } from "next/server";

type RouteHandler = (request: NextRequest, context: { params: Promise<{ id: string }> }) => Promise<Response>;

export const PUT: RouteHandler = async (request, context) => {
  const URL = "https://auton8n.moovmediagroup.com/webhook/45d08efd-1e10-4702-853a-5aefc36c399c/growth/users";
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(`${URL}/${id}`, {
      method: "PUT",
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
