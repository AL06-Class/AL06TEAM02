import type { ReactNode } from "react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, href, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-[22px] font-bold text-ink max-md:text-lg">{title}</h2>
      {href ? (
        <Link href={href} className="text-sm font-semibold text-muted hover:text-primary">
          더보기 →
        </Link>
      ) : (
        action
      )}
    </div>
  );
}

