import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeSecretKey, getStripeWebhookSecret, STRIPE_SHOP_ITEMS, StripeShopItemId } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabaseServer";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(`webhook:${ip}`, 100, 60000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    const stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: "2026-04-22.dahlia",
    });
    event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret());
  } catch (err) {
    console.error("[stripe/webhook] signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await fulfillCheckoutSession(event.data.object as Stripe.Checkout.Session);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe/webhook] fulfillment error:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id || session.metadata?.userId;
  const itemId = session.metadata?.itemId as StripeShopItemId | undefined;
  const item = itemId ? STRIPE_SHOP_ITEMS[itemId] : null;

  if (!userId || !item || session.payment_status !== "paid") return;

  const supabaseAdmin = getSupabaseAdmin();

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("purchases")
    .select("id, status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing?.status === "fulfilled") return;

  const updates = getFulfillmentUpdates(item);

  const { error: rpcError } = await supabaseAdmin.rpc("fulfill_purchase", {
    p_user_id: userId,
    p_session_id: session.id,
    p_item_id: item.id,
    p_item_type: item.type,
    p_quantity: item.quantity,
    p_gems: updates.gems || 0,
    p_keys: updates.keys || 0,
    p_revive_tokens: updates.revive_tokens || 0,
    p_is_ad_free: updates.is_ad_free ?? null,
    p_is_subscribed: updates.is_subscribed ?? null,
    p_subscription_expiry: updates.subscription_expiry ?? null,
    p_owned_cosmetics: updates.owned_cosmetics ?? null,
    p_active_vault_skin: updates.active_vault_skin ?? null,
    p_active_avatar: updates.active_avatar ?? null,
  });

  if (rpcError) throw rpcError;
}

function getFulfillmentUpdates(item: (typeof STRIPE_SHOP_ITEMS)[StripeShopItemId]) {
  if (item.type === "gems") return { gems: item.quantity };
  if (item.type === "bundle") return { gems: 100, keys: 10, revive_tokens: 2 };
  if (item.type === "adFree") return { is_ad_free: true };
  return {
    is_subscribed: true,
    subscription_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    gems: 1000,
    keys: 10,
    revive_tokens: 5,
    owned_cosmetics: ["vault-plus", "avatar-dragon"],
    active_vault_skin: "vault-plus",
    active_avatar: "avatar-dragon",
  };
}

