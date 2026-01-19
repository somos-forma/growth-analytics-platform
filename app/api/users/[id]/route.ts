import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const URL = "https://auton8n.moovmediagroup.com/webhook/45d08efd-1e10-4702-853a-5aefc36c399c/growth/users";
 try{

    const { id } = await params;
    const body = await request.json();
    
    const response = await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch ID token" },
      { status: 500 }
    );
  }
}

