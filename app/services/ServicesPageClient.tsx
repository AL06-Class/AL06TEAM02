"use client";

import { useSearchParams } from "next/navigation";
import { ServicesClient } from "./ServicesClient";

export function ServicesPageClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  return <ServicesClient initialTab={tabParam === "personal" ? "personal" : "company"} />;
}
