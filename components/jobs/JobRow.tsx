import Link from "next/link";
import { Badge, BadgeList } from "@/components/ui";
import { cn } from "@/components/ui/utils";

export interface JobRowData {
  id: number;
  companyName: string;
  title: string;
  category: string;
  region: string;
  careerLevel: string;
  equipment: string[];
  editingTools?: string[];
  shootingCategories?: string[];
  payAmount: string;
  deadlineType: string;
  deadline?: string;
  isPremium: boolean;
  status: string;
}

interface JobRowProps {
  job: JobRowData;
  basePath?: string;
}

function formatJobDeadline(job: Pick<JobRowData, "deadlineType" | "deadline">) {
  if (job.deadlineType !== "마감일") return job.deadlineType;
  if (!job.deadline) return "마감일 미정";
  const date = new Date(job.deadline);
  return `~${date.getMonth() + 1}/${date.getDate()}`;
}

export function JobRow({ job, basePath = "/jobs" }: JobRowProps) {
  const closed = job.status === "마감";

  return (
    <Link
      href={`${basePath}/${job.id}`}
      className={cn(
        "grid min-h-14 grid-cols-[140px_minmax(0,1fr)_200px_100px_110px_90px_90px] items-center gap-3 border-b border-line px-3 py-2 text-sm transition hover:bg-page",
        closed && "text-muted opacity-60",
      )}
    >
      <div className={cn("truncate", job.isPremium && "font-bold text-ink")}>
        <div className="flex items-center gap-1.5">
          {job.isPremium ? <Badge label="프리미엄" /> : null}
          <span className="truncate">{job.companyName}</span>
        </div>
      </div>
      <span className="truncate font-semibold text-ink">{job.title}</span>
      <BadgeList labels={[job.category, ...job.equipment, ...(job.editingTools ?? []), ...(job.shootingCategories ?? [])]} max={3} />
      <span className="truncate text-muted">{job.region}</span>
      <span className="truncate font-semibold text-ink">{job.payAmount}</span>
      <Badge label={job.careerLevel} />
      <Badge label={closed ? "마감" : formatJobDeadline(job)} tone={closed ? "danger" : undefined} />
    </Link>
  );
}
