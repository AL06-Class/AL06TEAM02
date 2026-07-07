import { jobs } from "@/data/jobs";
import { companyMembers } from "@/data/members";

type Job = (typeof jobs)[number];

function districtOnly(region: string) {
  const parts = region.split(" ").filter(Boolean);
  const guIndex = parts.findIndex((part) => part.endsWith("구"));
  if (guIndex >= 0) return parts.slice(0, guIndex + 1).join(" ");
  return parts.slice(0, 2).join(" ");
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? "영상 제작";
}

export function companyIdForJob(job: Job) {
  const member = companyMembers.find((company) => company.companyName === job.companyName);
  return member ? String(member.id) : `job-${job.id}`;
}

export function resolveCompany(identifier: string) {
  const jobId = identifier.startsWith("job-") ? identifier.replace("job-", "") : null;
  const sourceJob = jobId ? jobs.find((job) => String(job.id) === jobId) : null;
  const member = jobId ? null : companyMembers.find((company) => String(company.id) === identifier);
  const companyName = member?.companyName ?? sourceJob?.companyName;
  if (!companyName) return null;

  const companyJobs = jobs.filter((job) => job.companyName === companyName);
  const primaryJob = sourceJob ?? companyJobs[0];
  if (!primaryJob) return null;

  return {
    id: member ? String(member.id) : `job-${primaryJob.id}`,
    companyName,
    representativeName: member?.ceoName ?? primaryJob.managerName,
    industry: mostCommon(companyJobs.map((job) => job.category)),
    location: districtOnly(primaryJob.region),
    activeJobs: companyJobs.filter((job) => job.status === "게시중"),
    allJobs: companyJobs,
    ogImage: primaryJob.image,
  };
}
