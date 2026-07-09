"use client";

import { useSearchParams } from "next/navigation";
import { MyPageClient } from "../_components/MyPageClient";

export function MyApplicantsPageClient() {
  const searchParams = useSearchParams();
  return <MyPageClient page="applicants" searchJobId={searchParams.get("jobId")} />;
}
