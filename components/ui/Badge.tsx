import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export type BadgeTone = "accent" | "success" | "warning" | "danger" | "primary" | "muted";

export type BadgeLabel =
  | "프리미엄"
  | "추천"
  | "채용시"
  | "채용시까지"
  | "상시채용"
  | "인증완료"
  | "활동가능"
  | "심사중"
  | "검수중"
  | "공지"
  | "만료예정"
  | "마감"
  | "반려"
  | "신규"
  | "경력무관"
  | string;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: BadgeLabel;
  tone?: BadgeTone;
}

const statusTone: Record<string, BadgeTone> = {
  프리미엄: "accent",
  추천: "accent",
  채용시: "success",
  채용시까지: "success",
  상시채용: "success",
  인증완료: "success",
  활동가능: "success",
  심사중: "warning",
  검수중: "warning",
  공지: "warning",
  만료예정: "warning",
  마감: "danger",
  반려: "danger",
  신규: "primary",
  경력무관: "muted",
};

const toneClass: Record<BadgeTone, string> = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  primary: "bg-primary-soft text-primary",
  muted: "bg-page text-muted",
};

export function Badge({ label, tone, className, ...props }: BadgeProps) {
  const resolvedTone = tone ?? statusTone[label] ?? "muted";

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-sm px-2 py-0.5 text-xs font-semibold leading-5",
        "whitespace-nowrap",
        toneClass[resolvedTone],
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}

export function BadgeList({ labels, max = 4 }: { labels: BadgeLabel[]; max?: number }) {
  const visible = labels.slice(0, max);
  const rest = labels.length - visible.length;

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      {visible.map((label) => (
        <Badge key={label} label={label} />
      ))}
      {rest > 0 ? <Badge label={`+${rest}`} tone="muted" /> : null}
    </div>
  );
}

