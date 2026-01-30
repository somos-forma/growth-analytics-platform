import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

export async function GET() {
  const TARGET_AUDIENCE = process.env.CLOUD_RUN_URL ?? "https://example.com";
  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });
    const client = await auth.getIdTokenClient(TARGET_AUDIENCE);

    const response = await client.request({
      url: `${TARGET_AUDIENCE}/schema`,
      method: "GET",
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ID token" }, { status: 500 });
  }
}
