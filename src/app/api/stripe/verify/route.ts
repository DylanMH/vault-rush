import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getUserFromAuthorizationHeader } from "@/lib/supabaseServer";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(`verify:${ip}`, 20, 60000);
  if (!limit.allowed) {
    return NextResponse.json({ verified: false, error: "Rate limit exceeded" }, { status: 429 });
  }
  try {
    const user = await getUserFromAuthorizationHeader(req.headers.get("authorization"));
    if (!user) {
      return NextResponse.json({ verified: false, error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from("purchases")
      .select("item_id, item_type, quantity, status, fulfilled_at")
      .eq("stripe_session_id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    if (!data || data.status !== "fulfilled") {
      return NextResponse.json(
        { verified: false, error: "Purchase is still processing" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      verified: true,
      itemId: data.item_id,
      itemType: data.item_type,
      quantity: data.quantity,
      fulfilledAt: data.fulfilled_at,
    });
  } catch (err) {
    console.error("[stripe/verify] error:", err);
    return NextResponse.json(
      { verified: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
