import type { Metadata } from "next";
import { products } from "@/data/products";
import { resolveImagePath } from "@/lib/images";
import { StoreDetailClient } from "./StoreDetailClient";

interface StoreDetailPageProps {
  params: { id: string };
}

function findProduct(id: string) {
  return products.find((product) => String(product.id) === id);
}

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export function generateMetadata({ params }: StoreDetailPageProps): Metadata {
  const product = findProduct(params.id);
  if (!product) return { title: "스토어 상품" };
  return {
    title: `${product.name} | 스토어`,
    description: `${product.sellerName} · ${product.price.toLocaleString("ko-KR")}원 · ${product.category}`,
    openGraph: {
      title: `${product.name} | 촬영몬 스토어`,
      description: product.serviceScope,
      images: [resolveImagePath(product.image, "store")],
    },
  };
}

export default function StoreDetailPage({ params }: StoreDetailPageProps) {
  return <StoreDetailClient id={params.id} />;
}
