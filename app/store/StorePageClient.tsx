"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { ProductCard } from "@/components/store";
import { EmptyState, Pagination, Select } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { products } from "@/data/products";
import { readStorageJSON, storageKeys } from "@/lib/storage";

type Product = (typeof products)[number] & { status?: string };

const sortOptions = [
  { label: "등록일순", value: "recent" },
  { label: "판매량순", value: "sales" },
  { label: "평점순", value: "rating" },
  { label: "좋아요순", value: "likes" },
  { label: "낮은 가격순", value: "price-low" },
  { label: "높은 가격순", value: "price-high" },
] as const;

function pageItems<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return {
    totalPages,
    page: safePage,
    items: items.slice((safePage - 1) * pageSize, safePage * pageSize),
  };
}

function sortProducts(items: Product[], sort: string) {
  return [...items].sort((left, right) => {
    if (sort === "sales") return right.likes + right.rating * 10 - (left.likes + left.rating * 10);
    if (sort === "rating") return right.rating - left.rating;
    if (sort === "likes") return right.likes - left.likes;
    if (sort === "price-low") return left.price - right.price;
    if (sort === "price-high") return right.price - left.price;
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export function StorePageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [storedProducts, setStoredProducts] = useState<Product[]>([]);
  const category = searchParams.get("category") ?? "전체";
  const sort = searchParams.get("sort") ?? "recent";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  useEffect(() => {
    setStoredProducts(readStorageJSON<Product[]>(storageKeys.storeProducts, []));
  }, []);

  const visibleProducts = useMemo(() => {
    const merged = [...products, ...storedProducts.filter((item) => item.status === "판매중")];
    const filtered = category === "전체" ? merged : merged.filter((product) => product.category === category);
    return sortProducts(filtered, sort);
  }, [category, sort, storedProducts]);

  const categories = useMemo(() => ["전체", ...Array.from(new Set(products.map((product) => product.category)))], []);
  const current = pageItems(visibleProducts, page, 16);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "전체" || (key === "sort" && value === "recent")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink">스토어</h1>
          <p className="mt-1 text-sm text-muted">총 {visibleProducts.length}개 상품</p>
        </div>
        <Link href="/store/new" className="inline-flex h-10 items-center gap-2 rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark">
          <Plus aria-hidden className="h-4 w-4" />
          상품 등록
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => {
          const active = category === item;
          const href = item === "전체" ? "/store" : `/store?category=${encodeURIComponent(item)}`;
          return (
            <Link
              key={item}
              href={href}
              onClick={(event) => {
                event.preventDefault();
                setParam("category", item);
              }}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-md border px-3 text-sm font-semibold transition",
                active ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-muted hover:bg-page hover:text-ink",
              )}
            >
              {item}
            </Link>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Select aria-label="정렬" value={sort} onChange={(event) => setParam("sort", event.target.value)} options={sortOptions.map((option) => ({ label: option.label, value: option.value }))} className="w-[160px]" />
      </div>

      {current.items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {current.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title="조건에 맞는 상품이 없습니다." />
      )}

      <Pagination totalPages={current.totalPages} currentPage={current.page} />
    </div>
  );
}
