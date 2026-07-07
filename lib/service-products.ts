import { pricingProducts } from "@/data/pricing";

export type ServiceProductKey = "banner" | "jump" | "contact-pass" | "promotion";
export type ServiceAudience = "company" | "personal";

const pricingIdByKey: Record<ServiceProductKey, string> = {
  banner: "premium-banner",
  jump: "auto-jump",
  "contact-pass": "contact-pass",
  promotion: "recommended-profile",
};

export const serviceProductKeys = Object.keys(pricingIdByKey) as ServiceProductKey[];

export function isServiceProductKey(value: string): value is ServiceProductKey {
  return serviceProductKeys.includes(value as ServiceProductKey);
}

export function getServiceProduct(key: ServiceProductKey) {
  const product = pricingProducts.find((item) => item.id === pricingIdByKey[key]);
  if (!product) {
    throw new Error(`Unknown service product: ${key}`);
  }
  return {
    key,
    pricingId: product.id,
    audience: product.audience as ServiceAudience,
    placement: product.placement,
    name: product.name,
    description: product.description,
    prices: product.prices,
  };
}

export function getServiceProductByMaybeKey(value: string) {
  return isServiceProductKey(value) ? getServiceProduct(value) : null;
}

export function priceSummary(key: ServiceProductKey) {
  return getServiceProduct(key).prices.map((price) => `${price.amount.toLocaleString("ko-KR")}원/${price.label}`).join(" · ");
}

export function quantityFromLabel(label: string) {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : 1;
}
