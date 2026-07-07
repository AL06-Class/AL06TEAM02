import { MyPageClient } from "../_components/MyPageClient";

export default function MyApplicantsPage({ searchParams = {} }: { searchParams?: { jobId?: string } }) {
  return <MyPageClient page="applicants" searchJobId={searchParams.jobId ?? null} />;
}
