import { GoogleAuth } from "google-auth-library";
import { type NextRequest, NextResponse } from "next/server";

const test = undefined;
const test2 = "";
export async function POST(request: NextRequest) {
  const TARGET_AUDIENCE = process.env.CLOUD_RUN_URL!;
  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });
    const client = await auth.getIdTokenClient(TARGET_AUDIENCE);
    const body = await request.json();

    const response = await client.request({
      url: `${TARGET_AUDIENCE}/data`,
      method: "POST",
      data: body,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ID token" }, { status: 500 });
  }
}
