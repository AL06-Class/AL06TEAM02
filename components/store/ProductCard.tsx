import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatKrw } from "@/lib/format";
import { StoreFavoriteButton } from "./StoreFavoriteButton";

export interface StoreProductCardData {
  id: number;
  name: string;
  category: string;
  sellerName: string;
  price: number;
  rating: number;
  likes: number;
  commercialUse: boolean;
  image: string;
}

const storePlaceholder = "/images/presets/placeholders/shootmon-placeholder-store-01.svg";

function safeStoreImage(image: string) {
  return image.startsWith("/images/presets/store/") ? storePlaceholder : image || storePlaceholder;
}

export function ProductCard({ product }: { product: StoreProductCardData }) {
  return (
    <article className="group relative overflow-hidden rounded-md border border-line bg-surface shadow-card transition duration-150 hover:shadow-hover">
      <Link href={`/store/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-page">
          <Image
            src={safeStoreImage(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-150 group-hover:scale-[1.02]"
          />
          <Badge label={product.category} tone="muted" className="absolute left-2 top-2 max-w-[calc(100%-56px)]" />
        </div>
        <div className="space-y-1.5 p-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-ink">{product.name}</h3>
          <p className="truncate text-xs text-muted">{product.sellerName}</p>
          <p className="text-base font-black text-ink">{formatKrw(product.price)}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Star aria-hidden className="h-3.5 w-3.5 fill-warning text-warning" />
              {product.rating.toFixed(1)}
            </span>
            <span>♥ {product.likes}</span>
            <Badge label={product.commercialUse ? "상업 가능" : "상업 불가"} tone={product.commercialUse ? "success" : "muted"} />
          </div>
        </div>
      </Link>
      <StoreFavoriteButton productId={product.id} className="absolute right-2 top-2" />
    </article>
  );
}
