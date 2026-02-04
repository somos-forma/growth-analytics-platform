import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";
import type { RouteHandler } from "../../types/api.types";

export const GET: RouteHandler = async (_, context) => {
  const { id } = await context.params;
  try {
    const MERIDIAN_SERVICE_URL = process.env.MERIDIAN_SERVICE_URL ?? "https://example.com";
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });
    const client = await auth.getIdTokenClient(MERIDIAN_SERVICE_URL);

    const response = await client.request({
      url: `${MERIDIAN_SERVICE_URL}/meridian/${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Meridian-Env": "production",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Failed endpoint /meridian/${id}` }, { status: 500 });
  }
};
