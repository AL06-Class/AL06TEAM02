import Link from "next/link";
import { Badge } from "@/components/ui";
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

export const JOB_LIST_GRID_CLASS = "grid-cols-[1.05fr_2.9fr_1.3fr_0.75fr_0.9fr_0.7fr_0.75fr]";

function formatJobDeadline(job: Pick<JobRowData, "deadlineType" | "deadline">) {
  if (job.deadlineType !== "마감일") return job.deadlineType;
  if (!job.deadline) return "마감일 미정";
  const date = new Date(job.deadline);
  return `~${date.getMonth() + 1}/${date.getDate()}`;
}

export function JobRow({ job, basePath = "/jobs" }: JobRowProps) {
  const closed = job.status === "마감";
  const isEditorJob = basePath === "/editor-jobs";
  const optionCount = isEditorJob ? job.editingTools?.length || job.equipment.length : job.equipment.length;

  return (
    <Link
      href={`${basePath}/${job.id}`}
      className={cn(
        "grid min-h-14 items-center gap-3 border-b border-line px-3 py-2 text-sm transition hover:bg-page",
        JOB_LIST_GRID_CLASS,
        closed && "text-muted opacity-60",
      )}
    >
      <div className={cn("truncate", job.isPremium && "font-bold text-ink")}>
        <div className="flex items-center gap-1.5">
          {job.isPremium ? <Badge label="프리미엄" /> : null}
          <span className="truncate">{job.companyName}</span>
        </div>
      </div>
      <span className="min-w-0 truncate font-semibold text-ink">{job.title}</span>
      <div className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden">
        <Badge label={job.category} className="min-w-0 truncate" />
        {optionCount > 0 ? <Badge label={`+${optionCount}`} tone="muted" className="shrink-0" /> : null}
      </div>
      <span className="truncate text-muted">{job.region}</span>
      <span className="truncate font-semibold tabular-nums text-ink">{job.payAmount}</span>
      <Badge label={job.careerLevel} className="tabular-nums" />
      <Badge label={closed ? "마감" : formatJobDeadline(job)} tone={closed ? "danger" : undefined} className="tabular-nums" />
    </Link>
  );
}
