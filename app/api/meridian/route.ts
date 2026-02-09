import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";
import type { RouteHandler } from "../types/api.types";

export const POST: RouteHandler = async (request) => {
  try {
    const MERIDIAN_SERVICE_URL = process.env.MERIDIAN_SERVICE_URL ?? "https://example.com";
    const body = await request.json();
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });
    const client = await auth.getIdTokenClient(MERIDIAN_SERVICE_URL);

    const response = await client.request({
      url: `${MERIDIAN_SERVICE_URL}/meridian`,
      method: "POST",
      data: body,
      headers: {
        "Content-Type": "application/json",
        "X-Meridian-Env": "production",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(error);

    if (error.response?.status === 429) {
      return NextResponse.json(
        error.response?.data || {
          error: "QUEUE_LIMIT",
          message: "Demasiadas solicitudes. Por favor, intenta de nuevo en unos momentos.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json({ error: "Failed endpoint POST /meridian" }, { status: 500 });
  }
};

export const GET: RouteHandler = async (request) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "5";
    const since_hours = searchParams.get("since_hours") || "24";
    const MERIDIAN_SERVICE_URL = process.env.MERIDIAN_SERVICE_URL ?? "https://example.com";
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });

    const client = await auth.getIdTokenClient(MERIDIAN_SERVICE_URL);

    const response = await client.request({
      url: `${MERIDIAN_SERVICE_URL}/jobs?limit=${limit}&since_hours=${since_hours}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Meridian-Env": "production",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response?.status === 429) {
      return NextResponse.json(
        error.response?.data || {
          error: "QUEUE_LIMIT",
          message: "Demasiadas solicitudes. Por favor, intenta de nuevo en unos momentos.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json({ error: "Failed endpoint GET /jobs" }, { status: 500 });
  }
};
