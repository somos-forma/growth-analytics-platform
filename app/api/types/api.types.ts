import type { NextRequest } from "next/server";

export type RouteHandler = (request: NextRequest, context: { params: Promise<{ id: string }> }) => Promise<Response>;
