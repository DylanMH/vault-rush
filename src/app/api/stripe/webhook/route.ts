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

  const { error: upsertError } = await supabaseAdmin.from("purchases").upsert(
    {
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      user_id: userId,
      item_id: item.id,
      item_type: item.type,
      quantity: item.quantity,
      status: "processing",
    },
    { onConflict: "stripe_session_id" }
  );

  if (upsertError) throw upsertError;

  const { data: player, error: playerError } = await supabaseAdmin
    .from("players")
    .select("gems, keys, revive_tokens, owned_cosmetics")
    .eq("user_id", userId)
    .single();

  if (playerError) throw playerError;

  const updates = getFulfillmentUpdates(item);
  const { error: updateError } = await supabaseAdmin
    .from("players")
    .update({
      ...updates,
      gems: (player.gems || 0) + (updates.gems || 0),
      keys: (player.keys || 0) + (updates.keys || 0),
      revive_tokens: (player.revive_tokens || 0) + (updates.revive_tokens || 0),
      owned_cosmetics: mergeCosmetics(player.owned_cosmetics || [], updates.owned_cosmetics),
    })
    .eq("user_id", userId);

  if (updateError) throw updateError;

  const { error: fulfilledError } = await supabaseAdmin
    .from("purchases")
    .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
    .eq("stripe_session_id", session.id);

  if (fulfilledError) throw fulfilledError;
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

function mergeCosmetics(current: string[], added?: string[]) {
  if (!added?.length) return current;
  return Array.from(new Set([...current, ...added]));
}
