import { notFound } from "next/navigation";
import { jobs } from "@/data/jobs";
import { JobApplyFlow } from "./JobApplyFlow";

interface JobApplyPageProps {
  params: { id: string };
}

function findJob(id: string) {
  return jobs.find((job) => String(job.id) === id);
}

export default function JobApplyPage({ params }: JobApplyPageProps) {
  const job = findJob(params.id);
  if (!job) notFound();
  return <JobApplyFlow job={job} />;
}
