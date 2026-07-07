import Image from "next/image";
import Link from "next/link";
import { Badge, BadgeList } from "@/components/ui";
import { cn } from "@/components/ui/utils";

export interface JobCardData {
  id: number;
  companyName: string;
  title: string;
  category: string;
  region: string;
  careerLevel: string;
  equipment: string[];
  payAmount: string;
  deadlineType: string;
  deadline?: string;
  isPremium: boolean;
  status: string;
  image: string;
}

interface JobCardProps {
  job: JobCardData;
  compact?: boolean;
}

export function formatJobDeadline(job: Pick<JobCardData, "deadlineType" | "deadline">) {
  if (job.deadlineType !== "마감일") return job.deadlineType;
  if (!job.deadline) return "마감일 미정";
  const date = new Date(job.deadline);
  return `~${date.getMonth() + 1}/${date.getDate()}`;
}

export function JobCard({ job, compact = false }: JobCardProps) {
  const closed = job.status === "마감";
  const image = job.image || "/images/presets/placeholders/shootmon-placeholder-camera-01.svg";

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "group block overflow-hidden rounded-md border border-line bg-surface shadow-card transition duration-150 hover:shadow-hover",
        closed && "opacity-60 grayscale",
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-page">
        <Image
          src={image}
          alt={`${job.companyName} ${job.title}`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn("object-cover transition duration-150 group-hover:scale-[1.02]", closed && "opacity-40")}
        />
        <div className="absolute left-2 top-2 flex gap-1">
          {job.isPremium ? <Badge label="프리미엄" /> : null}
          {closed ? <Badge label="마감" /> : null}
        </div>
      </div>
      <div className={cn("p-3", compact ? "space-y-1.5" : "space-y-2")}>
        <p className="truncate text-[13px] font-medium text-muted">{job.companyName}</p>
        <h3 className={cn("font-bold text-ink", compact ? "line-clamp-3 text-sm" : "line-clamp-2 text-base")}>{job.title}</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge label={job.careerLevel} />
          <Badge label={formatJobDeadline(job)} tone={closed ? "danger" : undefined} />
        </div>
        {!compact ? <BadgeList labels={[job.category, ...job.equipment]} max={3} /> : null}
        <p className="truncate text-sm font-bold text-ink">{job.payAmount}</p>
      </div>
    </Link>
  );
}
