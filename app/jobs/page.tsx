import { JobsPageClient } from "./JobsPageClient";

interface JobsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function JobsPage({ searchParams = {} }: JobsPageProps) {
  return <JobsPageClient searchParams={searchParams} />;
}

