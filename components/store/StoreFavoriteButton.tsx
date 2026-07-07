"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { GateModal } from "@/components/shared/GateModal";
import { useAuth } from "@/lib/auth-context";
import { readStorageJSON, storageKeys, writeStorageJSON } from "@/lib/storage";
import { cn } from "@/components/ui/utils";

function readLikes() {
  return readStorageJSON<number[]>(storageKeys.storeLikes, []);
}

export function StoreFavoriteButton({ productId, className }: { productId: number; className?: string }) {
  const { role } = useAuth();
  const [liked, setLiked] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    setLiked(readLikes().includes(productId));
  }, [productId]);

  function toggle() {
    if (role === "guest") {
      setGateOpen(true);
      return;
    }
    const current = readLikes();
    const next = current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId];
    writeStorageJSON(storageKeys.storeLikes, next);
    setLiked(next.includes(productId));
  }

  return (
    <>
      <button
        type="button"
        aria-label={liked ? "찜 해제" : "찜하기"}
        aria-pressed={liked}
        onClick={toggle}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white/95 text-muted shadow-card transition hover:bg-page hover:text-danger",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          liked && "border-danger bg-danger-soft text-danger",
          className,
        )}
      >
        <Heart aria-hidden className={cn("h-4 w-4", liked && "fill-current")} />
      </button>
      <GateModal type="login" open={gateOpen} onClose={() => setGateOpen(false)} />
    </>
  );
}
