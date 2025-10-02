import { NextRequest, NextResponse } from "next/server";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

// простая серверная валидация contact: @handle или ссылка на t.me/instagram.com
function isValidContact(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const s = v.trim();
  if (!s) return false;
  const atHandle = /^@[A-Za-z0-9_.]{4,}$/i.test(s);
  const url = /^https?:\/\/(t\.me|telegram\.me|instagram\.com)\/[A-Za-z0-9_.]{3,}$/i.test(s);
  return atHandle || url;
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const {
    contact,
    specialty,
    referrer,
    utm,
    userAgent,
    locale,
    tzOffsetMin,
  } = (payload as {
    contact?: unknown;
    specialty?: unknown;
    referrer?: unknown;
    utm?: unknown;
    userAgent?: unknown;
    locale?: unknown;
    tzOffsetMin?: unknown;
  }) || {};

  // валидация contact
  if (!isValidContact(contact)) {
    return NextResponse.json(
      { ok: false, error: "Invalid contact (expect @handle or link)" },
      { status: 400 }
    );
  }

  // разбор UTM
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
    contact: contact.trim(), // 👈 новая колонка
    specialty:
      typeof specialty === "string" && specialty.trim() ? specialty.trim() : null,
    referrer:
      typeof referrer === "string" && referrer.trim() ? referrer : null,
    utm_params: utmParams,
    user_agent:
      typeof userAgent === "string" && userAgent.trim() ? userAgent : null,
    locale: typeof locale === "string" && locale.trim() ? locale : null,
    tz_offset_min:
      (typeof tzOffsetMin === "number" && Number.isFinite(tzOffsetMin)) ||
      (typeof tzOffsetMin === "string" && tzOffsetMin.trim() !== "" && !Number.isNaN(Number(tzOffsetMin)))
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
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}