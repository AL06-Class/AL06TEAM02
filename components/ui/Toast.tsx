"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "./utils";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setItems((current) => [...current, { id, type, message }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastViewport({ items }: { items: ToastItem[] }) {
  return (
    <div className="fixed inset-x-4 bottom-5 z-toast flex flex-col items-center gap-2 lg:left-auto lg:right-6 lg:items-end">
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          className={cn(
            "flex min-h-11 w-full max-w-sm items-center gap-2 rounded-md border bg-surface px-4 py-3 text-sm font-semibold shadow-modal",
            item.type === "success" ? "border-success-soft text-success" : "border-danger-soft text-danger",
          )}
        >
          {item.type === "success" ? (
            <CheckCircle2 aria-hidden className="h-5 w-5" />
          ) : (
            <XCircle aria-hidden className="h-5 w-5" />
          )}
          <span className="text-ink">{item.message}</span>
        </div>
      ))}
    </div>
  );
}

