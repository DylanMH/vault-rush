export type StripeShopItemId =
  | "gems-500"
  | "keys-5-usd"
  | "keys-20-usd"
  | "keys-50-usd"
  | "keys-100-usd"
  | "starter"
  | "adfree"
  | "plus";

export type StripeShopItem = {
  id: StripeShopItemId;
  priceId: string;
  mode: "payment" | "subscription";
  type: "gems" | "keys" | "bundle" | "adFree" | "subscription";
  quantity: number;
  label: string;
};

const stripeMode = process.env.STRIPE_MODE === "live" ? "live" : "test";

export const STRIPE_SHOP_ITEMS: Record<StripeShopItemId, StripeShopItem> = {
  "gems-500": {
    id: "gems-500",
    priceId: stripeMode === "test" ? "price_1TZiWnByXBrHdKMKoAIwVwmJ" : "price_1TZiWnByXBrHdKMKoAIwVwmJ",
    mode: "payment",
    type: "gems",
    quantity: 500,
    label: "Starter Gem Bundle",
  },
  "keys-5-usd": {
    id: "keys-5-usd",
    priceId: stripeMode === "test" ? "price_1TZiWGByXBrHdKMKjCeXpN77" : "price_1TZiWGByXBrHdKMKjCeXpN77",
    mode: "payment",
    type: "keys",
    quantity: 5,
    label: "5 Keys",
  },
  "keys-20-usd": {
    id: "keys-20-usd",
    priceId: stripeMode === "test" ? "price_1TZiUsByXBrHdKMK00w3mER9" : "price_1TZiUsByXBrHdKMK00w3mER9",
    mode: "payment",
    type: "keys",
    quantity: 20,
    label: "20 Keys",
  },
  "keys-50-usd": {
    id: "keys-50-usd",
    priceId: stripeMode === "test" ? "price_1TZiUsByXBrHdKMKuZVgZOyj" : "price_1TZiUsByXBrHdKMKuZVgZOyj",
    mode: "payment",
    type: "keys",
    quantity: 50,
    label: "50 Keys",
  },
  "keys-100-usd": {
    id: "keys-100-usd",
    priceId: stripeMode === "test" ? "price_1TZiUsByXBrHdKMKmtVLso5g" : "price_1TZiUsByXBrHdKMKmtVLso5g",
    mode: "payment",
    type: "keys",
    quantity: 100,
    label: "100 Keys",
  },
  starter: {
    id: "starter",
    priceId: stripeMode === "test" ? "price_1TZiW4ByXBrHdKMKFzK7clbP" : "price_1TZiW4ByXBrHdKMKFzK7clbP",
    mode: "payment",
    type: "bundle",
    quantity: 1,
    label: "Starter Bundle",
  },
  adfree: {
    id: "adfree",
    priceId: "price_placeholder_adfree",
    mode: "payment",
    type: "adFree",
    quantity: 1,
    label: "Ad-Free Upgrade",
  },
  plus: {
    id: "plus",
    priceId: stripeMode === "test" ? "price_1TZiW4ByXBrHdKMKXj6lRijV" : "price_1TZiW4ByXBrHdKMKXj6lRijV",
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
