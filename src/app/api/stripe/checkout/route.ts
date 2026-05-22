import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeSecretKey, STRIPE_SHOP_ITEMS, StripeShopItemId } from "@/lib/stripe";
import { getUserFromAuthorizationHeader } from "@/lib/supabaseServer";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(`checkout:${ip}`, 5, 60000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const user = await getUserFromAuthorizationHeader(req.headers.get("authorization"));
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: "2026-04-22.dahlia",
    });
    const body = await req.json();
    const itemId = body.itemId as StripeShopItemId | undefined;
    const item = itemId ? STRIPE_SHOP_ITEMS[itemId] : null;

    if (!item) {
      return NextResponse.json(
        { error: "Invalid item" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: item.priceId,
          quantity: 1,
        },
      ],
      mode: item.mode,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        itemId: item.id,
        itemType: item.type,
        quantity: String(item.quantity),
      },
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout] error:", err);
    return NextResponse.json(
      { error: "Checkout creation failed" },
      { status: 500 }
    );
  }
}
