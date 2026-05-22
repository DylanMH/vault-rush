export type StripeShopItemId = "gems-200" | "starter" | "adfree" | "plus";

export type StripeShopItem = {
  id: StripeShopItemId;
  priceId: string;
  mode: "payment" | "subscription";
  type: "gems" | "bundle" | "adFree" | "subscription";
  quantity: number;
  label: string;
};

const stripeMode = process.env.STRIPE_MODE === "live" ? "live" : "test";

export const STRIPE_SHOP_ITEMS: Record<StripeShopItemId, StripeShopItem> = {
  "gems-200": {
    id: "gems-200",
    priceId: stripeMode === "test" ? "price_1TZLBvByXBrHdKMK0SrXKYV2" : "price_1TZKo1ByXBrHdKMKF3ttBYpY",
    mode: "payment",
    type: "gems",
    quantity: 200,
    label: "200 Gems",
  },
  starter: {
    id: "starter",
    priceId: stripeMode === "test" ? "price_1TZLBwByXBrHdKMK55ZlT254" : "price_1TZKo1ByXBrHdKMKfdQVOVil",
    mode: "payment",
    type: "bundle",
    quantity: 1,
    label: "Starter Bundle",
  },
  adfree: {
    id: "adfree",
    priceId: stripeMode === "test" ? "price_1TZLBwByXBrHdKMK9O1FGMWu" : "price_1TZKo2ByXBrHdKMK9NCMRMA8",
    mode: "payment",
    type: "adFree",
    quantity: 1,
    label: "Ad-Free Upgrade",
  },
  plus: {
    id: "plus",
    priceId: stripeMode === "test" ? "price_1TZLBwByXBrHdKMKZ2URmrRU" : "price_1TZKo7ByXBrHdKMKj2aP9cpW",
    mode: "subscription",
    type: "subscription",
    quantity: 1,
    label: "Vault Rush Plus",
  },
};

export const STRIPE_PRICE_IDS: Record<string, string> = Object.fromEntries(
  Object.entries(STRIPE_SHOP_ITEMS).map(([id, item]) => [id, item.priceId])
);

export function getStripeSecretKey(): string {
  const key = stripeMode === "test" ? process.env.STRIPE_TEST_SECRET_KEY : process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing Stripe secret key");
  if (stripeMode === "live" && !key.startsWith("sk_live_")) throw new Error("Live Stripe mode requires a live secret key");
  if (stripeMode === "test" && !key.startsWith("sk_test_")) throw new Error("Test Stripe mode requires a test secret key");
  return key;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing Stripe webhook secret");
  return secret;
}
