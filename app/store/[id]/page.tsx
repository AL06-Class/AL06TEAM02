import type { Metadata } from "next";
import { products } from "@/data/products";
import { StoreDetailClient } from "./StoreDetailClient";

interface StoreDetailPageProps {
  params: { id: string };
}

function findProduct(id: string) {
  return products.find((product) => String(product.id) === id);
}

export function generateMetadata({ params }: StoreDetailPageProps): Metadata {
  const product = findProduct(params.id);
  if (!product) return { title: "스토어 상품 | 촬영몬" };
  return {
    title: `${product.name} | 촬영몬 스토어`,
    description: `${product.sellerName} · ${product.price.toLocaleString("ko-KR")}원 · ${product.category}`,
  };
}

export default function StoreDetailPage({ params }: StoreDetailPageProps) {
  return <StoreDetailClient id={params.id} />;
}
