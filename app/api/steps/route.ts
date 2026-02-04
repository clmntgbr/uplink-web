import { createAuthHeaders } from "@/lib/create-auth-headers";
import { requireAuth } from "@/lib/require-auth";
import { pick } from "lodash";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const backendUrl = new URL(`${BACKEND_API_URL}/steps`);

    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    const steps = pick(data, ["member", "totalItems", "currentPage", "itemsPerPage", "totalPages", "view"]);

    return NextResponse.json(steps);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const payload = await request.json();

    const headers = createAuthHeaders(auth.token);
    headers["Content-Type"] = "application/ld+json";

    const response = await fetch(`${BACKEND_API_URL}/steps`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    const step = pick(data, ["id", "position"]);

    return NextResponse.json(step);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
