import { ProfilesPageClient } from "./ProfilesPageClient";

interface ProfilesPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function ProfilesPage({ searchParams = {} }: ProfilesPageProps) {
  return <ProfilesPageClient searchParams={searchParams} />;
}

