import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";
import type { RouteHandler } from "../../types/api.types";

export const POST: RouteHandler = async (request) => {
  try {
    const TARGET_AUDIENCE = process.env.CLOUD_RUN_URL ?? "https://example.com";
    const body = await request.json();
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });
    const client = await auth.getIdTokenClient(TARGET_AUDIENCE);

    const response = await client.request({
      url: `${TARGET_AUDIENCE}/eda`,
      method: "POST",
      data: body,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ID token" }, { status: 500 });
  }
};
