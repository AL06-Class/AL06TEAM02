import { ServicesClient } from "./ServicesClient";

interface ServicesPageProps {
  searchParams?: { tab?: string | string[] };
}

export default function ServicesPage({ searchParams = {} }: ServicesPageProps) {
  const tabParam = Array.isArray(searchParams.tab) ? searchParams.tab[0] : searchParams.tab;
  return <ServicesClient initialTab={tabParam === "personal" ? "personal" : "company"} />;
}
