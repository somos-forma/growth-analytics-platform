import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const URL = "https://auton8n.moovmediagroup.com/webhook/growth/users";
 try{

    const body = await request.json();
    
    const response = await fetch(`${URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch ID token" },
      { status: 500 }
    );
  }
}

