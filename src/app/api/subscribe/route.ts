import { NextRequest, NextResponse } from "next/server";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const {
    email,
    name,
    specialty,
    telegram,
    referrer,
    utm,
    userAgent,
    locale,
    tzOffsetMin,
  } = (payload as {
    email?: unknown;
    name?: unknown;
    specialty?: unknown;
    telegram?: unknown;
    referrer?: unknown;
    utm?: unknown;
    userAgent?: unknown;
    locale?: unknown;
    tzOffsetMin?: unknown;
  }) || {};

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 }
    );
  }

  let utmParams: Record<string, string> | null = null;
  if (typeof utm === "string" && utm.trim()) {
    try {
      const params = new URLSearchParams(utm);
      const entries = Object.fromEntries(params.entries());
      utmParams = Object.keys(entries).length ? entries : null;
    } catch {
      utmParams = null;
    }
  }

  const insert = {
    email,
    name: typeof name === "string" && name.trim() ? name.trim() : null,
    specialty:
      typeof specialty === "string" && specialty.trim() ? specialty.trim() : null,
    telegram:
      typeof telegram === "string" && telegram.trim() ? telegram.trim() : null,
    referrer: typeof referrer === "string" && referrer.trim() ? referrer : null,
    utm_params: utmParams,
    user_agent:
      typeof userAgent === "string" && userAgent.trim() ? userAgent : null,
    locale: typeof locale === "string" && locale.trim() ? locale : null,
    tz_offset_min:
      (typeof tzOffsetMin === "number" && Number.isFinite(tzOffsetMin)) ||
      (typeof tzOffsetMin === "string" &&
        tzOffsetMin.trim() !== "" &&
        !Number.isNaN(Number(tzOffsetMin)))
        ? Number(tzOffsetMin)
        : null,
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(insert),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Supabase insert error:", text);
      return NextResponse.json({ ok: false, error: "DB error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Supabase request error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}