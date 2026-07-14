import Link from "next/link";
import { Badge, BadgeList, SmartImage } from "@/components/ui";
import { cn } from "@/components/ui/utils";

export interface ProfileCardData {
  id: number;
  maskedName: string;
  gender?: string;
  birthYear?: number;
  title: string;
  region: string;
  categories: string[];
  equipment: string[];
  desiredPay: string;
  careerYears: number;
  status: string;
  isRecommended: boolean;
  avatar: string;
  cover: string;
}

interface ProfileCardProps {
  profile: ProfileCardData;
  compact?: boolean;
  hrefBase?: string;
}

export function ProfileCard({ profile, compact = false, hrefBase = "/profiles" }: ProfileCardProps) {
  const age = profile.birthYear ? `${new Date().getFullYear() - profile.birthYear}세` : "팀";

  return (
    <Link
      href={`${hrefBase}/${profile.id}`}
      className="group block overflow-hidden rounded-md border border-line bg-surface shadow-card transition duration-150 hover:shadow-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-page">
        <SmartImage
          src={profile.cover}
          fallback="profile"
          alt={`${profile.maskedName} ${profile.title}`}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition duration-150 group-hover:scale-[1.02]"
        />
        {profile.isRecommended ? <Badge label="추천" className="absolute left-2 top-2" /> : null}
      </div>
      <div className={cn("p-3", compact ? "space-y-1.5" : "space-y-2")}>
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-surface bg-page shadow-card">
            <SmartImage src={profile.avatar} fallback="profile" alt={profile.maskedName} fill sizes="36px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{profile.maskedName}</p>
            <p className="truncate text-xs text-muted">{profile.gender ? `${profile.gender} · ${age}` : age}</p>
          </div>
        </div>
        <h3 className="line-clamp-2 text-base font-bold text-ink max-md:text-sm">{profile.title}</h3>
        <p className="truncate text-sm text-muted">
          {profile.region} · {profile.careerYears}년
        </p>
        <BadgeList labels={[...profile.categories.slice(0, 2), ...profile.equipment.slice(0, compact ? 1 : 2)]} max={compact ? 3 : 4} />
        <p className="truncate text-base font-bold text-ink max-md:text-sm">{profile.desiredPay}</p>
      </div>
    </Link>
  );
}
