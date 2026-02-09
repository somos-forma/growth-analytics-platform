import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";
import type { RouteHandler } from "../types/api.types";

export const GET: RouteHandler = async (request) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get("mode");
    const percent = searchParams.get("percent") || "10";
    const start_date = searchParams.get("start_date") || "2026-01-01";
    const end_date = searchParams.get("end_date") || "2026-02-08";

    const CLOUD_RUN_URL = process.env.CLOUD_RUN_URL ?? "https://example.com";
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });

    const client = await auth.getIdTokenClient(CLOUD_RUN_URL);
    const url =
      mode === "percent"
        ? `${CLOUD_RUN_URL}/preview?mode=${mode}&percent=${percent}`
        : `${CLOUD_RUN_URL}/preview?mode=${mode}&start_date=${start_date}&end_date=${end_date}`;

    const response = await client.request({
      url,
      method: "GET",
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ error: "Failed endpoint GET /preview" }, { status: 500 });
  }
};
