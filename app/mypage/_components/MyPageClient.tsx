"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  Eye,
  ImageIcon,
  Lock,
  Megaphone,
  Package,
  Plus,
  Rocket,
  Settings,
  Upload,
  UserRound,
} from "lucide-react";
import { JobRow } from "@/components/jobs/JobRow";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { ProposeModal } from "@/components/shared/ProposeModal";
import { Badge, Button, EmptyState, FileUpload, Input, Modal, Select, SmartImage, Stepper, Table, Tabs, Textarea, Toggle, useToast } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { companyMembers, personalMembers } from "@/data/members";
import { jobs } from "@/data/jobs";
import { products } from "@/data/products";
import { profiles } from "@/data/profiles";
import { useAuth, type VerifyStatus } from "@/lib/auth-context";
import { formatDate, formatDday, formatKrw, maskName } from "@/lib/format";
import { readStorageJSON, storageKeys, writeStorageJSON } from "@/lib/storage";

export type MyPageKey =
  | "home"
  | "profile"
  | "portfolio"
  | "applications"
  | "scraps"
  | "products"
  | "promotion"
  | "payments"
  | "account"
  | "company"
  | "verification"
  | "jobs"
  | "applicants"
  | "contact-pass"
  | "jump"
  | "banners";

type AccountKind = "personal" | "company";
type ApplicationStatus = "지원완료" | "열람됨" | "마감";
type MyJobStatus = "게시중" | "심사중" | "반려" | "마감";
type ProductStatus = "검수중" | "판매중" | "반려" | "비공개";
type StoreProductRecord = (typeof products)[number] & { status?: ProductStatus };

interface ApplicationRecord {
  id: string;
  jobId: number;
  jobTitle: string;
  companyName: string;
  profileId: number | null;
  title: string;
  message: string;
  includePortfolio: boolean;
  extraLink: string;
  appliedAt: string;
  status?: ApplicationStatus;
}

interface PaymentRecord {
  id: string;
  productKey?: string;
  productName: string;
  optionLabel?: string;
  amount: number;
  paidAt: string;
  status?: string;
}

interface ProposalRecord {
  id: string;
  profileId: number;
  receiverName: string;
  jobId: number;
  message: string;
  sentAt: string;
}

interface PortfolioImage {
  id: string;
  src: string;
  featured: boolean;
}

interface PortfolioLink {
  id: string;
  type: string;
  url: string;
  featured: boolean;
}

interface ProfileState {
  hasProfile: boolean;
  isPublic: boolean;
  workStatus: string;
  reviewStatus: "공개" | "검수중" | "반려";
  rejectedReason: string;
}

interface PortfolioState {
  images: PortfolioImage[];
  links: PortfolioLink[];
}

interface AccountState {
  email: string;
  phone: string;
  nickname: string;
}

interface CompanyState {
  companyName: string;
  ceoName: string;
  industry: string;
  region: string;
  managerName: string;
  intro: string;
  bizNumber: string;
}

interface MyJob {
  id: number;
  jobType: "shooting" | "editing";
  title: string;
  status: MyJobStatus;
  deadline: string;
  isPremium: boolean;
  jumpOn: boolean;
  rejectedReason?: string;
  updatedAt: string;
  jumpCount: number;
}

interface JumpHistory {
  id: string;
  jobId: number;
  jobTitle: string;
  type: "자동" | "수동";
  usedAt: string;
  remaining: number;
}

interface ContactLog {
  id: string;
  profileId: number;
  profileName: string;
  viewedAt: string;
}

interface BannerState {
  clickUrl: string;
  creativeStatus: "검수중" | "승인" | "반려";
  clicks: number;
}

const MYPAGE_KEYS = {
  profile: storageKeys.mypageProfile,
  portfolio: storageKeys.mypagePortfolio,
  account: "shootmon:mypage:account",
  company: "shootmon:mypage:company",
  jobs: storageKeys.mypageJobs,
  jumpHistory: "shootmon:mypage:jump-history",
  contactLogs: "shootmon:mypage:contact-logs",
  banner: "shootmon:mypage:banner",
  productStatuses: storageKeys.mypageProductStatuses,
};

const currentPersonal = personalMembers[0];
const currentProfile = profiles.find((profile) => profile.maskedName === currentPersonal.maskedName) ?? profiles[0];
const currentCompany = companyMembers[0];
const emptyApplications: ApplicationRecord[] = [];
const emptyPayments: PaymentRecord[] = [];
const emptyJobScraps: number[] = [];
const emptyProfileScraps: number[] = [];
const emptyProposals: ProposalRecord[] = [];
const emptyJumpHistory: JumpHistory[] = [];
const emptyContactLogs: ContactLog[] = [];
const emptyProductStatuses: Record<string, ProductStatus> = {};
const emptyStoreProducts: StoreProductRecord[] = [];
const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";
const linkSecondaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page";

const personalMenu = [
  { key: "profile", label: "내 프로필", href: "/mypage/profile", icon: UserRound },
  { key: "applications", label: "지원한 공고", href: "/mypage/applications", icon: BriefcaseBusiness },
  { key: "scraps", label: "스크랩", href: "/mypage/scraps", icon: Bookmark },
  { key: "alerts", label: "받은 제안", href: "/alerts", icon: Bell },
  { key: "portfolio", label: "포트폴리오", href: "/mypage/portfolio", icon: ImageIcon },
  { key: "products", label: "내 상품", href: "/mypage/products", icon: Package },
  { key: "promotion", label: "추천 프로필", href: "/mypage/promotion", icon: Megaphone },
  { key: "payments", label: "결제 내역", href: "/mypage/payments", icon: CreditCard },
  { key: "account", label: "회원정보", href: "/mypage/account", icon: Settings },
] as const;

const companyMenu = [
  { key: "verification", label: "인증 상태", href: "/mypage/verification", icon: CheckCircle2 },
  { key: "jobs", label: "공고 관리", href: "/mypage/jobs", icon: BriefcaseBusiness },
  { key: "applicants", label: "지원자", href: "/mypage/applicants", icon: UserRound },
  { key: "contact-pass", label: "열람권", href: "/mypage/contact-pass", icon: Eye },
  { key: "jump", label: "자동점프", href: "/mypage/jump", icon: Rocket },
  { key: "banners", label: "배너", href: "/mypage/banners", icon: Megaphone },
  { key: "scraps", label: "스크랩 프로필", href: "/mypage/scraps", icon: Bookmark },
  { key: "payments", label: "결제 내역", href: "/mypage/payments", icon: CreditCard },
  { key: "company", label: "기업정보", href: "/mypage/company", icon: Building2 },
  { key: "account", label: "회원정보", href: "/mypage/account", icon: Settings },
] as const;

const pageTitles: Record<MyPageKey, string> = {
  home: "마이페이지",
  profile: "내 프로필 관리",
  portfolio: "포트폴리오 관리",
  applications: "지원한 공고",
  scraps: "스크랩",
  products: "내 스토어 상품",
  promotion: "추천 프로필 현황",
  payments: "결제 내역",
  account: "회원정보 수정",
  company: "기업정보 관리",
  verification: "기업 인증",
  jobs: "공고 관리",
  applicants: "지원자 관리",
  "contact-pass": "연락처 열람권",
  jump: "자동점프",
  banners: "프리미엄 배너",
};

const personalAllowed = new Set<MyPageKey>(["home", "profile", "portfolio", "applications", "scraps", "products", "promotion", "payments", "account"]);
const companyAllowed = new Set<MyPageKey>(["home", "scraps", "products", "company", "verification", "jobs", "applicants", "contact-pass", "jump", "banners", "payments", "account"]);

function useStoredState<T>(key: string, fallback: T) {
  const [state, setState] = useState(fallback);

  useEffect(() => {
    setState(readStorageJSON<T>(key, fallback));
  }, [fallback, key]);

  const update = useCallback(
    (nextValue: T | ((current: T) => T)) => {
      setState((current) => {
        const next = typeof nextValue === "function" ? (nextValue as (value: T) => T)(current) : nextValue;
        writeStorageJSON(key, next);
        return next;
      });
    },
    [key],
  );

  return [state, update] as const;
}

function daysLeft(value: string | null | undefined) {
  if (!value) return null;
  const today = new Date();
  const target = new Date(value);
  const diff = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

function isExpiringSoon(value: string | null | undefined) {
  const dday = daysLeft(value);
  return dday !== null && dday >= 0 && dday <= 3;
}

function verifyTone(status: VerifyStatus) {
  if (status === "인증완료") return "success" as const;
  if (status === "반려") return "danger" as const;
  return "warning" as const;
}

function productStatusFor(id: number, statuses: Record<string, ProductStatus>): ProductStatus {
  return statuses[String(id)] ?? (id % 5 === 0 ? "비공개" : id % 4 === 0 ? "검수중" : id % 7 === 0 ? "반려" : "판매중");
}

function applicationStatus(application: ApplicationRecord, jobStatus?: string): ApplicationStatus {
  if (jobStatus === "마감") return "마감";
  return application.status ?? "지원완료";
}

function createPortfolioFallback(): PortfolioState {
  return {
    images: currentProfile.portfolioImages.map((src, index) => ({ id: `image-${index}`, src, featured: index === 0 })),
    links: currentProfile.portfolioLinks.map((url, index) => ({ id: `link-${index}`, type: url.includes("youtu") ? "YouTube" : "외부", url, featured: index === 0 })),
  };
}

function createCompanyFallback(): CompanyState {
  return {
    companyName: currentCompany.companyName,
    ceoName: currentCompany.ceoName,
    industry: "영상 제작",
    region: "서울 강남구",
    managerName: "김담당",
    intro: "브랜드 영상과 캠페인 콘텐츠를 제작하는 스튜디오입니다.",
    bizNumber: currentCompany.bizNumber,
  };
}

function createJobsFallback(): MyJob[] {
  const ownJobs = jobs.filter((job) => job.companyName === currentCompany.companyName);
  return ownJobs.map((job, index) => ({
    id: job.id,
    jobType: "shooting" as const,
    title: job.title,
    status: index === 1 ? "심사중" : index === 2 ? "반려" : job.status === "마감" ? "마감" : "게시중",
    deadline: job.deadline ?? "상시채용",
    isPremium: job.isPremium,
    jumpOn: false,
    rejectedReason: index === 2 ? "증빙 자료가 부족합니다." : undefined,
    updatedAt: job.createdAt,
    jumpCount: 0,
  }));
}

function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-md border border-line bg-surface p-5 shadow-card", className)}>{children}</section>;
}

function StatCard({ label, value, href, tone = "primary" }: { label: string; value: string | number; href: string; tone?: "primary" | "success" | "warning" | "accent" }) {
  const toneClass = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    accent: "bg-accent text-ink",
  }[tone];

  return (
    <Link href={href} className="rounded-md border border-line bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-hover">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className={cn("mt-3 inline-flex rounded-sm px-2 py-1 text-xl font-black", toneClass)}>{value}</p>
    </Link>
  );
}

function StatusBanner({ tone, title, children, action }: { tone: "warning" | "danger" | "success"; title: string; children?: ReactNode; action?: ReactNode }) {
  const toneClass = {
    warning: "border-warning bg-warning-soft/55 text-warning",
    danger: "border-danger bg-danger-soft/55 text-danger",
    success: "border-success bg-success-soft/55 text-success",
  }[tone];

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3", toneClass)}>
      <div className="flex min-w-0 items-start gap-2">
        <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold">{title}</p>
          {children ? <div className="mt-1 text-sm text-ink/75">{children}</div> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

function ProductPurchaseCard({ title, description, href, action }: { title: string; description: string; href: string; action: string }) {
  return (
    <SectionCard className="text-center">
      <Package aria-hidden className="mx-auto h-10 w-10 text-primary" />
      <h2 className="mt-4 text-xl font-black text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-[520px] text-sm text-muted">{description}</p>
      <Link href={href} className={cn(linkPrimaryClass, "mt-5")}>
        {action}
      </Link>
    </SectionCard>
  );
}

function ProfileRegistrationActions() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Link href="/profiles/new" className={linkPrimaryClass}>촬영자 프로필 등록</Link>
      <Link href="/editor-profiles/new" className={linkSecondaryClass}>편집자 프로필 등록</Link>
    </div>
  );
}

function routeKind(role: string): AccountKind | null {
  if (role === "personal") return "personal";
  if (role === "company-unverified" || role === "company-verified" || role === "admin") return "company";
  return null;
}

export function MyPageClient({ page, searchJobId = null }: { page: MyPageKey; searchJobId?: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, isReady, mockState, setMockState } = useAuth();
  const kind = routeKind(role);

  const profileFallback = useMemo<ProfileState>(
    () => ({ hasProfile: currentPersonal.hasProfile, isPublic: true, workStatus: currentProfile.status, reviewStatus: "공개", rejectedReason: "포트폴리오 링크 확인이 필요합니다." }),
    [],
  );
  const portfolioFallback = useMemo(createPortfolioFallback, []);
  const accountFallback = useMemo<AccountState>(() => ({ email: currentPersonal.email, phone: "010-1234-5678", nickname: currentPersonal.nickname }), []);
  const companyFallback = useMemo(createCompanyFallback, []);
  const jobsFallback = useMemo(createJobsFallback, []);
  const bannerFallback = useMemo<BannerState>(() => ({ clickUrl: "https://shootmon.example.kr", creativeStatus: "검수중", clicks: 124 }), []);

  const [profileState, setProfileState] = useStoredState(MYPAGE_KEYS.profile, profileFallback);
  const [portfolioState, setPortfolioState] = useStoredState(MYPAGE_KEYS.portfolio, portfolioFallback);
  const [accountState, setAccountState] = useStoredState(MYPAGE_KEYS.account, accountFallback);
  const [companyState, setCompanyState] = useStoredState(MYPAGE_KEYS.company, companyFallback);
  const [myJobs, setMyJobs] = useStoredState(MYPAGE_KEYS.jobs, jobsFallback);
  const [jumpHistory, setJumpHistory] = useStoredState<JumpHistory[]>(MYPAGE_KEYS.jumpHistory, emptyJumpHistory);
  const [contactLogs, setContactLogs] = useStoredState<ContactLog[]>(MYPAGE_KEYS.contactLogs, emptyContactLogs);
  const [bannerState, setBannerState] = useStoredState(MYPAGE_KEYS.banner, bannerFallback);
  const [productStatuses, setProductStatuses] = useStoredState<Record<string, ProductStatus>>(MYPAGE_KEYS.productStatuses, emptyProductStatuses);
  const [storeProducts] = useStoredState<StoreProductRecord[]>(storageKeys.storeProducts, emptyStoreProducts);
  const [applications, setApplications] = useStoredState<ApplicationRecord[]>(storageKeys.applications, emptyApplications);
  const [payments] = useStoredState<PaymentRecord[]>(storageKeys.payments, emptyPayments);
  const [jobScraps, setJobScraps] = useStoredState<number[]>(storageKeys.jobScraps, emptyJobScraps);
  const [profileScraps, setProfileScraps] = useStoredState<number[]>(storageKeys.profileScraps, emptyProfileScraps);
  const [proposals] = useStoredState<ProposalRecord[]>(storageKeys.proposals, emptyProposals);

  const allowed = useMemo(() => (kind === "personal" ? personalAllowed : kind === "company" ? companyAllowed : new Set<MyPageKey>()), [kind]);

  useEffect(() => {
    if (!isReady) return;
    if (role === "guest") {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed.has(page)) {
      router.replace("/mypage");
    }
  }, [allowed, isReady, page, pathname, role, router]);

  if (!isReady || role === "guest" || !kind || !allowed.has(page)) {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">마이페이지 접근 권한을 확인하는 중입니다.</div>;
  }

  const title = pageTitles[page];
  const menu = kind === "personal" ? personalMenu : companyMenu;
  const statusBadge = kind === "personal" ? (profileState.hasProfile ? (profileState.reviewStatus === "공개" ? "공개중" : profileState.reviewStatus) : "미등록") : mockState.verifyStatus;

  const personalStats = {
    applications: applications.length,
    scraps: jobScraps.length,
    proposals: proposals.filter((item) => item.profileId === currentProfile.id).length,
    products: [...products, ...storeProducts].filter((product) => product.sellerName === currentProfile.maskedName).length,
  };
  const newApplicants = applications.filter((item) => myJobs.some((job) => job.id === item.jobId) && item.status !== "열람됨").length;
  const companyStats = {
    jobs: myJobs.filter((job) => job.status !== "마감").length,
    applicants: newApplicants,
    contactPass: mockState.hasContactPass ? formatDday(mockState.contactPassExpiry ?? undefined) : "미보유",
    jumpCredits: mockState.jumpCredits,
  };

  return (
    <div className="lg:flex lg:gap-6">
      <aside className="hidden w-[220px] shrink-0 lg:block">
        <div className="sticky top-24 rounded-md border border-line bg-surface p-4 shadow-card">
          <div className="text-center">
            <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full border border-line bg-page">
              {kind === "personal" ? (
                <SmartImage src={currentProfile.avatar} fallback="profile" alt={currentProfile.maskedName} fill sizes="64px" className="object-cover" />
              ) : (
                <Building2 aria-hidden className="m-4 h-8 w-8 text-muted" />
              )}
            </div>
            <p className="mt-3 truncate text-sm font-black text-ink">{kind === "personal" ? currentPersonal.maskedName : maskName(companyState.companyName)}</p>
            <p className="mt-1 text-xs text-muted">{kind === "personal" ? "개인회원" : "기업회원"}</p>
            <Badge label={statusBadge} tone={kind === "company" ? verifyTone(mockState.verifyStatus) : undefined} className="mt-2" />
          </div>
          <nav className="mt-5 space-y-1 border-t border-line pt-4">
            {kind === "company" ? <CompanyProfileRegistrationLinks /> : null}
            {menu.map((item) => {
              const active = item.key === page;
              const Icon = item.icon;
              const locked = kind === "company" && mockState.verifyStatus !== "인증완료" && ["jobs", "applicants"].includes(item.key);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-sm border-l-[3px] px-2 text-sm font-semibold transition",
                    active ? "border-primary bg-primary-soft text-primary" : "border-transparent text-muted hover:bg-page hover:text-ink",
                  )}
                >
                  <Icon aria-hidden className="h-4 w-4" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {locked ? <Lock aria-hidden className="h-3.5 w-3.5" /> : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {page !== "home" ? (
          <div className="mb-4 flex items-center gap-3 lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => router.push("/mypage")} leftIcon={<ArrowLeft aria-hidden className="h-4 w-4" />}>
              뒤로
            </Button>
            <h1 className="text-xl font-black text-ink">{title}</h1>
          </div>
        ) : null}
        <div className="hidden lg:block">
          <h1 className="mb-5 text-2xl font-black text-ink">{title}</h1>
        </div>
        {kind === "company" && page !== "home" && mockState.verifyStatus !== "인증완료" ? (
          <div className="mb-5">
            <CorporateVerificationBanner status={mockState.verifyStatus} />
          </div>
        ) : null}
        <PageBody
          page={page}
          kind={kind}
          profileState={profileState}
          setProfileState={setProfileState}
          portfolioState={portfolioState}
          setPortfolioState={setPortfolioState}
          accountState={accountState}
          setAccountState={setAccountState}
          companyState={companyState}
          setCompanyState={setCompanyState}
          myJobs={myJobs}
          setMyJobs={setMyJobs}
          jumpHistory={jumpHistory}
          setJumpHistory={setJumpHistory}
          contactLogs={contactLogs}
          setContactLogs={setContactLogs}
          bannerState={bannerState}
          setBannerState={setBannerState}
          storeProducts={storeProducts}
          productStatuses={productStatuses}
          setProductStatuses={setProductStatuses}
          applications={applications}
          setApplications={setApplications}
          payments={payments}
          jobScraps={jobScraps}
          setJobScraps={setJobScraps}
          profileScraps={profileScraps}
          setProfileScraps={setProfileScraps}
          proposals={proposals}
          personalStats={personalStats}
          companyStats={companyStats}
          searchJobId={searchJobId}
        />
      </div>
    </div>
  );
}

function PageBody(props: {
  page: MyPageKey;
  kind: AccountKind;
  profileState: ProfileState;
  setProfileState: (next: ProfileState | ((current: ProfileState) => ProfileState)) => void;
  portfolioState: PortfolioState;
  setPortfolioState: (next: PortfolioState | ((current: PortfolioState) => PortfolioState)) => void;
  accountState: AccountState;
  setAccountState: (next: AccountState | ((current: AccountState) => AccountState)) => void;
  companyState: CompanyState;
  setCompanyState: (next: CompanyState | ((current: CompanyState) => CompanyState)) => void;
  myJobs: MyJob[];
  setMyJobs: (next: MyJob[] | ((current: MyJob[]) => MyJob[])) => void;
  jumpHistory: JumpHistory[];
  setJumpHistory: (next: JumpHistory[] | ((current: JumpHistory[]) => JumpHistory[])) => void;
  contactLogs: ContactLog[];
  setContactLogs: (next: ContactLog[] | ((current: ContactLog[]) => ContactLog[])) => void;
  bannerState: BannerState;
  setBannerState: (next: BannerState | ((current: BannerState) => BannerState)) => void;
  storeProducts: StoreProductRecord[];
  productStatuses: Record<string, ProductStatus>;
  setProductStatuses: (next: Record<string, ProductStatus> | ((current: Record<string, ProductStatus>) => Record<string, ProductStatus>)) => void;
  applications: ApplicationRecord[];
  setApplications: (next: ApplicationRecord[] | ((current: ApplicationRecord[]) => ApplicationRecord[])) => void;
  payments: PaymentRecord[];
  jobScraps: number[];
  setJobScraps: (next: number[] | ((current: number[]) => number[])) => void;
  profileScraps: number[];
  setProfileScraps: (next: number[] | ((current: number[]) => number[])) => void;
  proposals: ProposalRecord[];
  personalStats: { applications: number; scraps: number; proposals: number; products: number };
  companyStats: { jobs: number; applicants: number; contactPass: string; jumpCredits: number };
  searchJobId: string | null;
}) {
  if (props.page === "home") {
    return props.kind === "personal" ? <PersonalDashboard {...props} /> : <CompanyDashboard {...props} />;
  }
  if (props.page === "profile") return <ProfilePage {...props} />;
  if (props.page === "portfolio") return <PortfolioPage {...props} />;
  if (props.page === "applications") return <ApplicationsPage applications={props.applications} />;
  if (props.page === "scraps") return props.kind === "personal" ? <JobScrapsPage jobScraps={props.jobScraps} setJobScraps={props.setJobScraps} /> : <ProfileScrapsPage profileScraps={props.profileScraps} setProfileScraps={props.setProfileScraps} />;
  if (props.page === "products") return <ProductsPage kind={props.kind} storeProducts={props.storeProducts} productStatuses={props.productStatuses} setProductStatuses={props.setProductStatuses} />;
  if (props.page === "promotion") return <PromotionPage />;
  if (props.page === "payments") return <PaymentsPage payments={props.payments} kind={props.kind} />;
  if (props.page === "account") return <AccountPage accountState={props.accountState} setAccountState={props.setAccountState} kind={props.kind} />;
  if (props.page === "company") return <CompanyPage companyState={props.companyState} setCompanyState={props.setCompanyState} />;
  if (props.page === "verification") return <VerificationPage />;
  if (props.page === "jobs") return <JobsManagePage myJobs={props.myJobs} setMyJobs={props.setMyJobs} applications={props.applications} setJumpHistory={props.setJumpHistory} />;
  if (props.page === "applicants") return <ApplicantsPage myJobs={props.myJobs} applications={props.applications} setApplications={props.setApplications} searchJobId={props.searchJobId} />;
  if (props.page === "contact-pass") return <ContactPassPage contactLogs={props.contactLogs} />;
  if (props.page === "jump") return <JumpPage myJobs={props.myJobs} setMyJobs={props.setMyJobs} jumpHistory={props.jumpHistory} setJumpHistory={props.setJumpHistory} />;
  return <BannersPage bannerState={props.bannerState} setBannerState={props.setBannerState} />;
}

function PersonalDashboard({ profileState, personalStats, applications, payments, proposals }: { profileState: ProfileState; personalStats: { applications: number; scraps: number; proposals: number; products: number }; applications: ApplicationRecord[]; payments: PaymentRecord[]; proposals: ProposalRecord[] }) {
  const activities = [
    ...applications.map((item) => ({ id: item.id, at: item.appliedAt, label: `${item.companyName} 공고에 지원` })),
    ...proposals.filter((item) => item.profileId === currentProfile.id).map((item) => ({ id: item.id, at: item.sentAt, label: `${item.receiverName}에게 제안 도착` })),
    ...payments.map((item) => ({ id: item.id, at: item.paidAt, label: `${item.productName} 결제` })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <h1 className="text-2xl font-black text-ink">마이페이지</h1>
      </div>
      {profileState.hasProfile ? (
        <SectionCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-line bg-page">
              <SmartImage src={currentProfile.avatar} fallback="profile" alt={currentProfile.maskedName} fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-ink">{currentProfile.title}</h2>
                <Badge label={profileState.workStatus} />
                {currentProfile.isRecommended ? <Badge label="추천" /> : null}
              </div>
              <p className="mt-2 text-sm text-muted">
                조회수 {currentProfile.id * 128} · 최종수정 {formatDate(currentProfile.updatedAt)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/mypage/profile" className={linkPrimaryClass}>
                  프로필 수정
                </Link>
                <Link href={`/profiles/${currentProfile.id}`} className={linkSecondaryClass}>
                  미리보기
                </Link>
              </div>
            </div>
          </div>
        </SectionCard>
      ) : (
        <EmptyState
          title="등록된 촬영자 프로필이 없습니다"
          action={<ProfileRegistrationActions />}
          className="rounded-md border border-line bg-surface shadow-card"
        />
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="지원" value={`${personalStats.applications}건`} href="/mypage/applications" />
        <StatCard label="스크랩" value={`${personalStats.scraps}건`} href="/mypage/scraps" tone="accent" />
        <StatCard label="받은 제안" value={`${personalStats.proposals}건`} href="/alerts" tone="success" />
        <StatCard label="내 상품" value={`${personalStats.products}건`} href="/mypage/products" tone="warning" />
      </div>
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-ink">모집 공고 등록</h2>
            <p className="mt-1 text-sm text-muted">개인 계정에서도 데모 등록 화면을 확인할 수 있습니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/jobs/new" className={linkPrimaryClass}>촬영자 모집 등록</Link>
            <Link href="/editor-jobs/new" className={linkSecondaryClass}>편집자 모집 등록</Link>
          </div>
        </div>
      </SectionCard>
      <MobileMenu kind="personal" />
      <RecentActivity items={activities} />
    </div>
  );
}

function CompanyDashboard({ companyState, companyStats }: { companyState: CompanyState; companyStats: { jobs: number; applicants: number; contactPass: string; jumpCredits: number } }) {
  const { mockState } = useAuth();

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <h1 className="text-2xl font-black text-ink">마이페이지</h1>
      </div>
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-line bg-page">
            <Building2 aria-hidden className="h-10 w-10 text-muted" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-ink">{companyState.companyName}</h2>
              <Badge label={mockState.verifyStatus} tone={verifyTone(mockState.verifyStatus)} />
            </div>
            <p className="mt-2 text-sm text-muted">
              {companyState.industry} · {companyState.region}
            </p>
          </div>
        </div>
        {mockState.verifyStatus !== "인증완료" ? (
          <div className="mt-4">
            <CorporateVerificationBanner status={mockState.verifyStatus} />
          </div>
        ) : null}
      </SectionCard>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="진행 공고" value={companyStats.jobs} href="/mypage/jobs" />
        <StatCard label="신규 지원자" value={companyStats.applicants} href="/mypage/applicants" tone="accent" />
        <StatCard label="열람권" value={companyStats.contactPass} href="/mypage/contact-pass" tone="success" />
        <StatCard label="점프 크레딧" value={`${companyStats.jumpCredits}건`} href="/mypage/jump" tone="warning" />
      </div>
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-ink">모집 공고 등록</h2>
            <p className="mt-1 text-sm text-muted">등록할 모집 유형을 선택하세요.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/jobs/new" className={linkPrimaryClass}>촬영자 모집 등록</Link>
            <Link href="/editor-jobs/new" className={linkSecondaryClass}>편집자 모집 등록</Link>
          </div>
        </div>
      </SectionCard>
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-ink">프로필 등록</h2>
            <p className="mt-1 text-sm text-muted">기업 계정도 촬영자 또는 편집자 프로필을 등록할 수 있습니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/profiles/new" className={linkPrimaryClass}>촬영자 프로필 등록</Link>
            <Link href="/editor-profiles/new" className={linkSecondaryClass}>편집자 프로필 등록</Link>
          </div>
        </div>
      </SectionCard>
      <MobileMenu kind="company" />
      <RecentActivity items={[{ id: "company-activity-1", at: new Date().toISOString(), label: "기업 마이페이지 상태가 최신화되었습니다" }]} />
    </div>
  );
}

function MobileMenu({ kind }: { kind: AccountKind }) {
  const menu = kind === "personal" ? personalMenu : companyMenu;
  return (
    <div className="space-y-2 lg:hidden">
      {kind === "company" ? <CompanyProfileRegistrationLinks /> : null}
      {menu.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.key} href={item.href} className="flex h-12 items-center gap-3 rounded-md border border-line bg-surface px-3 text-sm font-bold text-ink shadow-card">
            <Icon aria-hidden className="h-4 w-4 text-muted" />
            <span className="flex-1">{item.label}</span>
            <ChevronRight aria-hidden className="h-4 w-4 text-muted" />
          </Link>
        );
      })}
    </div>
  );
}

function CompanyProfileRegistrationLinks() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-3 space-y-2 border-b border-line pb-3">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex h-10 w-full items-center gap-2 rounded-sm px-2 text-sm font-bold text-ink hover:bg-page" aria-expanded={open}>
        <UserRound aria-hidden className="h-4 w-4 text-muted" />
        <span className="flex-1 text-left">내 기업프로필</span>
        <ChevronDown aria-hidden className={cn("h-4 w-4 text-muted transition", open ? "rotate-180" : "")} />
      </button>
      {open ? (
        <div className="space-y-1 border-l-2 border-line pl-3">
          <Link href="/profiles/new" className="flex h-9 items-center rounded-sm px-2 text-xs font-bold text-muted transition hover:bg-primary-soft hover:text-primary">
            촬영자 프로필 등록
          </Link>
          <Link href="/editor-profiles/new" className="flex h-9 items-center rounded-sm px-2 text-xs font-bold text-muted transition hover:bg-primary-soft hover:text-primary">
            편집자 프로필 등록
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function RecentActivity({ items }: { items: Array<{ id: string; at: string; label: string }> }) {
  return (
    <SectionCard>
      <h2 className="text-lg font-black text-ink">최근 활동</h2>
      {items.length > 0 ? (
        <ol className="mt-4 divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-3 text-sm">
              <Clock3 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <div>
                <p className="font-semibold text-ink">{item.label}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(item.at)}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState title="최근 활동이 없습니다" className="min-h-40" />
      )}
    </SectionCard>
  );
}

function CorporateVerificationBanner({ status }: { status: VerifyStatus }) {
  const router = useRouter();
  const { setMockState } = useAuth();
  const { showToast } = useToast();

  function completeDemoVerification() {
    setMockState({ verifyStatus: "인증완료" });
    showToast("데모 기업 인증이 완료되었습니다.");
    router.push("/mypage/jobs");
  }

  if (status === "반려") {
    return (
      <StatusBanner
        tone="danger"
        title="기업 인증이 반려되었습니다"
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/mypage/verification" className={linkSecondaryClass}>
              재제출
            </Link>
            <Button variant="outline" onClick={completeDemoVerification}>
              데모 인증 완료
            </Button>
          </div>
        }
      >
        사업자 정보와 제출 서류가 일치하지 않습니다.
      </StatusBanner>
    );
  }
  return (
    <StatusBanner
      tone="warning"
      title={status === "검수중" ? "기업 인증 검수중입니다" : "기업 인증이 필요합니다"}
      action={
        <div className="flex flex-wrap gap-2">
          <Link href="/mypage/verification" className={linkSecondaryClass}>
            인증하러 가기
          </Link>
          <Button variant="outline" onClick={completeDemoVerification}>
            데모 인증 완료
          </Button>
        </div>
      }
    >
      인증 전에는 공고와 지원자 관련 기능이 제한됩니다. 데모에서는 인증 완료 후 등록 화면을 바로 확인할 수 있습니다.
    </StatusBanner>
  );
}

function ProfilePage({ profileState, setProfileState }: { profileState: ProfileState; setProfileState: (next: ProfileState | ((current: ProfileState) => ProfileState)) => void }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!profileState.hasProfile) {
    return (
      <EmptyState
        title="아직 등록된 촬영자 프로필이 없습니다"
        action={<ProfileRegistrationActions />}
        className="rounded-md border border-line bg-surface shadow-card"
      />
    );
  }

  return (
    <div className="space-y-5">
      {profileState.reviewStatus === "검수중" ? <StatusBanner tone="warning" title="프로필이 검수중입니다">검수 완료 전까지 공개 상태 변경이 제한될 수 있습니다.</StatusBanner> : null}
      {profileState.reviewStatus === "반려" ? (
        <StatusBanner
          tone="danger"
          title="프로필이 반려되었습니다"
          action={
            <Button size="sm" variant="outline" onClick={() => setProfileState((current) => ({ ...current, reviewStatus: "검수중" }))}>
              수정 후 재요청
            </Button>
          }
        >
          {profileState.rejectedReason}
        </StatusBanner>
      ) : null}
      <SectionCard>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-page lg:w-[280px]">
            <SmartImage src={currentProfile.cover} fallback="profile" alt={currentProfile.title} fill sizes="280px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-ink">{currentProfile.title}</h2>
              <Badge label={profileState.isPublic ? "공개중" : "비공개"} tone={profileState.isPublic ? "success" : "muted"} />
            </div>
            <p className="mt-2 text-sm text-muted">
              {currentProfile.region} · {currentProfile.careerYears}년 · {currentProfile.desiredPay}
            </p>
            <p className="mt-4 text-sm leading-6 text-ink">{currentProfile.intro}</p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <InfoItem label="분야" value={currentProfile.categories.join(", ")} />
              <InfoItem label="장비" value={currentProfile.equipment.join(", ")} />
              <InfoItem label="출장" value={currentProfile.travelAvailable ? "가능" : "불가"} />
              <InfoItem label="스튜디오" value={currentProfile.hasStudio ? "보유" : "미보유"} />
            </dl>
          </div>
        </div>
      </SectionCard>
      <SectionCard>
        <h2 className="text-lg font-black text-ink">상태 설정</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Toggle checked={profileState.isPublic} label={profileState.isPublic ? "공개" : "비공개"} onChange={(checked) => setProfileState((current) => ({ ...current, isPublic: checked }))} />
          <Select
            label="현재상태"
            value={profileState.workStatus}
            options={["활동가능", "일정협의", "프로젝트중"].map((value) => ({ label: value, value }))}
            onChange={(event) => setProfileState((current) => ({ ...current, workStatus: event.target.value }))}
          />
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Link href="/profiles/new" className={linkSecondaryClass}>
            촬영자 프로필 수정
          </Link>
          <Link href="/editor-profiles/new" className={linkSecondaryClass}>
            편집자 프로필 등록
          </Link>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            삭제
          </Button>
        </div>
      </SectionCard>
      <Modal open={deleteOpen} title="프로필 삭제" description="삭제하면 마이페이지에서는 미등록 상태로 표시됩니다." onClose={() => setDeleteOpen(false)}>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setProfileState((current) => ({ ...current, hasProfile: false }));
              setDeleteOpen(false);
            }}
          >
            삭제
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-page px-3 py-2">
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}

function PortfolioPage({ portfolioState, setPortfolioState }: { portfolioState: PortfolioState; setPortfolioState: (next: PortfolioState | ((current: PortfolioState) => PortfolioState)) => void }) {
  const [newLink, setNewLink] = useState("");

  function moveImage(index: number, direction: -1 | 1) {
    setPortfolioState((current) => {
      const next = [...current.images];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...current, images: next };
    });
  }

  return (
    <div className="space-y-5">
      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-black text-ink">이미지</h2>
          <Button
            variant="outline"
            leftIcon={<Upload aria-hidden className="h-4 w-4" />}
            onClick={() =>
              setPortfolioState((current) => ({
                ...current,
                images: [...current.images, { id: `image-${Date.now()}`, src: currentProfile.portfolioImages[current.images.length % currentProfile.portfolioImages.length], featured: false }],
              }))
            }
          >
            추가 업로드
          </Button>
        </div>
        {portfolioState.images.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioState.images.map((item, index) => (
              <div key={item.id} className="rounded-md border border-line bg-page p-2">
                <div className="relative aspect-video overflow-hidden rounded-sm bg-surface">
                  <SmartImage src={item.src} fallback="profile" alt="포트폴리오 이미지" fill sizes="260px" className="object-cover" />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <input
                      type="radio"
                      name="featuredImage"
                      checked={item.featured}
                      onChange={() => setPortfolioState((current) => ({ ...current, images: current.images.map((image) => ({ ...image, featured: image.id === item.id })) }))}
                    />
                    대표
                  </label>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" disabled={index === 0} onClick={() => moveImage(index, -1)} leftIcon={<ArrowUp aria-hidden className="h-4 w-4" />}>
                      위
                    </Button>
                    <Button size="sm" variant="ghost" disabled={index === portfolioState.images.length - 1} onClick={() => moveImage(index, 1)}>
                      아래
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setPortfolioState((current) => ({ ...current, images: current.images.filter((image) => image.id !== item.id) }))}>
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="등록된 포트폴리오 이미지가 없습니다" />
        )}
      </SectionCard>
      <SectionCard>
        <h2 className="text-lg font-black text-ink">링크</h2>
        <div className="mt-4 flex gap-2">
          <Input label="링크 추가" value={newLink} onChange={(event) => setNewLink(event.target.value)} placeholder="https://" className="min-w-0" />
          <Button
            className="self-end"
            leftIcon={<Plus aria-hidden className="h-4 w-4" />}
            disabled={!newLink.trim()}
            onClick={() => {
              setPortfolioState((current) => ({
                ...current,
                links: [...current.links, { id: `link-${Date.now()}`, type: newLink.includes("youtu") ? "YouTube" : "외부", url: newLink.trim(), featured: current.links.length === 0 }],
              }));
              setNewLink("");
            }}
          >
            추가
          </Button>
        </div>
        {portfolioState.links.length > 0 ? (
          <div className="mt-4 divide-y divide-line rounded-md border border-line">
            {portfolioState.links.map((item) => (
              <div key={item.id} className="grid gap-3 p-3 text-sm md:grid-cols-[90px_minmax(0,1fr)_auto] md:items-center">
                <Badge label={item.type} />
                <span className="min-w-0 truncate font-semibold text-ink">{item.url}</span>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant={item.featured ? "primary" : "secondary"} onClick={() => setPortfolioState((current) => ({ ...current, links: current.links.map((link) => ({ ...link, featured: link.id === item.id })) }))}>
                    대표
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPortfolioState((current) => ({ ...current, links: current.links.filter((link) => link.id !== item.id) }))}>
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="등록된 포트폴리오 링크가 없습니다" className="min-h-40" />
        )}
      </SectionCard>
    </div>
  );
}

function ApplicationsPage({ applications }: { applications: ApplicationRecord[] }) {
  const [selected, setSelected] = useState<ApplicationRecord | null>(null);
  const rows = applications.map((application) => ({ application, job: jobs.find((job) => job.id === application.jobId) }));

  if (rows.length === 0) {
    return (
      <EmptyState
        title="아직 지원한 공고가 없습니다"
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/jobs" className={linkPrimaryClass}>
              공고 탐색하기
            </Link>
            <Link href="/jobs/new" className={linkSecondaryClass}>
              촬영자 모집 등록
            </Link>
            <Link href="/editor-jobs/new" className={linkSecondaryClass}>
              편집자 모집 등록
            </Link>
          </div>
        }
        className="rounded-md border border-line bg-surface shadow-card"
      />
    );
  }

  return (
    <>
      <Table
        rows={rows}
        getRowKey={(row) => row.application.id}
        columns={[
          { key: "status", header: "상태", render: (row) => <Badge label={applicationStatus(row.application, row.job?.status)} /> },
          {
            key: "job",
            header: "공고",
            render: (row) => (
              <Link href={`/jobs/${row.application.jobId}`} className="font-bold text-ink hover:text-primary">
                {row.application.companyName} · {row.application.jobTitle}
              </Link>
            ),
          },
          { key: "date", header: "지원일", render: (row) => formatDate(row.application.appliedAt) },
          {
            key: "action",
            header: "액션",
            render: (row) => (
              <Button size="sm" variant="outline" onClick={() => setSelected(row.application)}>
                지원 내용 보기
              </Button>
            ),
          },
        ]}
      />
      <Modal open={Boolean(selected)} title="지원 내용" onClose={() => setSelected(null)} size="form">
        {selected ? (
          <div className="space-y-3 text-sm">
            <p className="font-bold text-ink">{selected.title}</p>
            <p className="whitespace-pre-line leading-6 text-muted">{selected.message || "저장된 지원 메시지가 없습니다."}</p>
            {selected.extraLink ? <p className="text-primary">{selected.extraLink}</p> : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}

function JobScrapsPage({ jobScraps, setJobScraps }: { jobScraps: number[]; setJobScraps: (next: number[] | ((current: number[]) => number[])) => void }) {
  const scraps = jobScraps;

  function remove(id: number) {
    setJobScraps((current) => current.filter((item) => item !== id));
  }

  const scrappedJobs = jobs.filter((job) => scraps.includes(job.id));

  if (scrappedJobs.length === 0) {
    return (
      <EmptyState
        title="스크랩한 공고가 없습니다"
        action={
          <Link href="/jobs" className={linkPrimaryClass}>
            공고 탐색하기
          </Link>
        }
        className="rounded-md border border-line bg-surface shadow-card"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface shadow-card">
      {scrappedJobs.map((job) => (
        <div key={job.id} className="grid gap-2 border-b border-line p-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <JobRow job={job} />
          <Button size="sm" variant="outline" onClick={() => remove(job.id)}>
            스크랩 해제
          </Button>
        </div>
      ))}
    </div>
  );
}

function ProfileScrapsPage({ profileScraps, setProfileScraps }: { profileScraps: number[]; setProfileScraps: (next: number[] | ((current: number[]) => number[])) => void }) {
  const scraps = profileScraps;
  const { mockState } = useAuth();
  const scrappedProfiles = profiles.filter((profile) => scraps.includes(profile.id));

  function remove(id: number) {
    setProfileScraps((current) => current.filter((item) => item !== id));
  }

  if (scrappedProfiles.length === 0) {
    return (
      <EmptyState
        title="스크랩한 프로필이 없습니다"
        action={
          <Link href="/profiles" className={linkPrimaryClass}>
            프로필 탐색하기
          </Link>
        }
        className="rounded-md border border-line bg-surface shadow-card"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {scrappedProfiles.map((profile) => (
        <div key={profile.id} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge label={mockState.hasContactPass ? "열람함" : "미열람"} tone={mockState.hasContactPass ? "success" : "muted"} />
            <Button size="sm" variant="outline" onClick={() => remove(profile.id)}>
              스크랩 해제
            </Button>
          </div>
          <ProfileCard profile={profile} compact />
        </div>
      ))}
    </div>
  );
}

function ProductsPage({
  kind,
  storeProducts,
  productStatuses,
  setProductStatuses,
}: {
  kind: AccountKind;
  storeProducts: StoreProductRecord[];
  productStatuses: Record<string, ProductStatus>;
  setProductStatuses: (next: Record<string, ProductStatus> | ((current: Record<string, ProductStatus>) => Record<string, ProductStatus>)) => void;
}) {
  const sellerName = kind === "personal" ? currentProfile.maskedName : currentCompany.companyName;
  const ownProducts: StoreProductRecord[] = [...(products as unknown as StoreProductRecord[]), ...storeProducts].filter((product) => product.sellerName === sellerName);

  if (ownProducts.length === 0) {
    return (
      <EmptyState
        title="등록된 스토어 상품이 없습니다"
        action={
          <Link href="/store/new" className={linkPrimaryClass}>
            상품 등록
          </Link>
        }
        className="rounded-md border border-line bg-surface shadow-card"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/store/new" className={linkPrimaryClass}>
          + 상품 등록
        </Link>
      </div>
      <div className="grid gap-3">
        {ownProducts.map((product) => {
          const status = productStatuses[String(product.id)] ?? product.status ?? productStatusFor(product.id, productStatuses);
          return (
            <SectionCard key={product.id}>
              <div className="grid gap-4 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center">
                <div className="relative aspect-video overflow-hidden rounded-md bg-page">
                  <SmartImage src={product.image} fallback="store" alt={product.name} fill sizes="140px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-black text-ink">{product.name}</h2>
                    <Badge label={status} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{product.category}</p>
                  <p className="mt-2 font-bold text-ink">{formatKrw(product.price)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/store/new" className={linkSecondaryClass}>
                    수정
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setProductStatuses((current) => ({ ...current, [product.id]: status === "비공개" ? "판매중" : "비공개" }))}
                  >
                    {status === "비공개" ? "판매 전환" : "비공개 전환"}
                  </Button>
                  <Button variant="danger" onClick={() => setProductStatuses((current) => ({ ...current, [product.id]: "비공개" }))}>
                    삭제
                  </Button>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}

function PromotionPage() {
  const { mockState } = useAuth();
  const endDate = "2026-07-31";
  const expiring = isExpiringSoon(endDate);

  if (!mockState.hasPromotion) {
    return <ProductPurchaseCard title="추천 프로필 노출이 필요합니다" description="메인 추천 영역과 프로필 목록 상단에 노출되는 유료 상품입니다." href="/services/order/promotion" action="신청하기" />;
  }

  return (
    <div className="space-y-5">
      {expiring ? (
        <StatusBanner
          tone="warning"
          title="추천 노출 만료가 임박했습니다"
          action={
            <Link href="/services/order/promotion" className={linkSecondaryClass}>
              기간 연장
            </Link>
          }
        >
          만료 3일 전부터 연장 구매가 권장됩니다.
        </StatusBanner>
      ) : null}
      <SectionCard>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-muted">현재 상태</span>
          <Badge label="노출중" tone="success" />
          <span className="text-sm text-muted">2026-07-01 ~ 2026-07-31 ({formatDday(endDate)})</span>
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <InfoItem label="노출 위치" value="메인 추천 영역 · 프로필 목록 상단" />
          <InfoItem label="누적 노출 기간" value="2개월" />
        </dl>
        <Link href="/services/order/promotion" className={cn(linkPrimaryClass, "mt-5")}>
          기간 연장 구매
        </Link>
      </SectionCard>
    </div>
  );
}

function PaymentsPage({ payments, kind }: { payments: PaymentRecord[]; kind: AccountKind }) {
  const [selected, setSelected] = useState<PaymentRecord | null>(null);

  if (payments.length === 0) {
    return <EmptyState title="결제 내역이 없습니다" className="rounded-md border border-line bg-surface shadow-card" />;
  }

  return (
    <>
      <Table
        rows={payments}
        getRowKey={(row) => row.id}
        columns={[
          { key: "date", header: "날짜", render: (row) => formatDate(row.paidAt) },
          { key: "product", header: "상품명", render: (row) => `${row.productName}${row.optionLabel ? ` · ${row.optionLabel}` : ""}` },
          { key: "amount", header: "금액", render: (row) => formatKrw(row.amount) },
          { key: "status", header: "상태", render: (row) => <Badge label={row.status ?? "결제완료"} tone="success" /> },
          ...(kind === "company" ? [{ key: "tax", header: "세금계산서", render: () => <span className="text-muted">정책 미확정</span> }] : []),
          {
            key: "receipt",
            header: "영수증",
            render: (row) => (
              <Button size="sm" variant="outline" onClick={() => setSelected(row)}>
                영수증
              </Button>
            ),
          },
        ]}
      />
      <Modal open={Boolean(selected)} title="영수증" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-2 text-sm">
            <p className="font-bold text-ink">{selected.productName}</p>
            <p className="text-muted">{formatDate(selected.paidAt)}</p>
            <p className="text-lg font-black text-ink">{formatKrw(selected.amount)}</p>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

function AccountPage({ accountState, setAccountState, kind }: { accountState: AccountState; setAccountState: (next: AccountState | ((current: AccountState) => AccountState)) => void; kind: AccountKind }) {
  const [draft, setDraft] = useState(accountState);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { showToast } = useToast();

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountState(draft);
    showToast("회원정보가 저장되었습니다.");
  }

  return (
    <div className="space-y-5">
      <SectionCard>
        <h2 className="text-lg font-black text-ink">기본 정보</h2>
        <p className="mt-1 text-sm text-muted">비밀번호 확인 게이트는 데모에서 즉시 통과됩니다.</p>
        <form onSubmit={save} className="mt-5 grid gap-4 md:grid-cols-2">
          <Input label="이메일" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} />
          <Input label="휴대폰" value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} />
          <Input label={kind === "personal" ? "닉네임" : "담당자명"} value={draft.nickname} onChange={(event) => setDraft((current) => ({ ...current, nickname: event.target.value }))} />
          <Input label="새 비밀번호" type="password" placeholder="변경 시 입력" />
          <div className="md:col-span-2">
            <Button type="submit">저장</Button>
          </div>
        </form>
      </SectionCard>
      <details className="rounded-md border border-danger bg-danger-soft/25 p-5">
        <summary className="cursor-pointer text-sm font-bold text-danger">회원 탈퇴</summary>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <Select label="사유" options={["이용 빈도 낮음", "원하는 기능 없음", "다른 서비스 이용", "기타"].map((value) => ({ label: value, value }))} />
          <Button variant="danger" onClick={() => setWithdrawOpen(true)}>
            탈퇴 진행
          </Button>
        </div>
      </details>
      <Modal open={withdrawOpen} title="회원 탈퇴 확인" description="확인 문구를 입력해야 탈퇴 버튼이 활성화됩니다." onClose={() => setWithdrawOpen(false)}>
        <div className="space-y-4">
          <Input label="확인 문구" value={confirmText} onChange={(event) => setConfirmText(event.target.value)} placeholder="탈퇴합니다" />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setWithdrawOpen(false)}>
              취소
            </Button>
            <Button variant="danger" disabled={confirmText !== "탈퇴합니다"} onClick={() => setWithdrawOpen(false)}>
              탈퇴
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CompanyPage({ companyState, setCompanyState }: { companyState: CompanyState; setCompanyState: (next: CompanyState | ((current: CompanyState) => CompanyState)) => void }) {
  const [draft, setDraft] = useState(companyState);
  const { showToast } = useToast();

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCompanyState(draft);
    showToast("기업정보가 저장되었습니다.");
  }

  return (
    <SectionCard>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
        <Input label="회사명" value={draft.companyName} onChange={(event) => setDraft((current) => ({ ...current, companyName: event.target.value }))} />
        <Input label="대표자" value={draft.ceoName} onChange={(event) => setDraft((current) => ({ ...current, ceoName: event.target.value }))} />
        <Input label="업종" value={draft.industry} onChange={(event) => setDraft((current) => ({ ...current, industry: event.target.value }))} />
        <Input label="소재지" value={draft.region} onChange={(event) => setDraft((current) => ({ ...current, region: event.target.value }))} />
        <Input label="담당자" value={draft.managerName} onChange={(event) => setDraft((current) => ({ ...current, managerName: event.target.value }))} />
        <Input label="사업자등록번호" value={draft.bizNumber} disabled helperText="변경 시 재인증이 필요합니다." />
        <Textarea label="소개" value={draft.intro} onChange={(event) => setDraft((current) => ({ ...current, intro: event.target.value }))} className="md:col-span-2" />
        <div className="flex flex-wrap gap-2 md:col-span-2">
          <Button type="submit">저장</Button>
          <Link href={`/company/${currentCompany.id}`} className={linkSecondaryClass}>
            공개 화면 미리보기
          </Link>
        </div>
      </form>
    </SectionCard>
  );
}

function VerificationPage() {
  const router = useRouter();
  const { mockState, setMockState } = useAuth();
  const { showToast } = useToast();
  const [hasFiles, setHasFiles] = useState(false);
  const currentStep = mockState.verifyStatus === "인증완료" ? 2 : mockState.verifyStatus === "검수중" ? 1 : 0;

  function submit() {
    if (!hasFiles && mockState.verifyStatus !== "반려") {
      showToast("제출 서류를 추가해 주세요.", "error");
      return;
    }
    setMockState({ verifyStatus: "검수중" });
    showToast("서류가 제출되었습니다.");
  }

  function completeDemoVerification() {
    setMockState({ verifyStatus: "인증완료" });
    showToast("데모 기업 인증이 완료되었습니다.");
    router.push("/mypage/jobs");
  }

  return (
    <div className="space-y-5">
      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted">현재 상태</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge label={mockState.verifyStatus} tone={verifyTone(mockState.verifyStatus)} />
            </div>
          </div>
          <Stepper steps={["서류 제출", "검수중", "인증완료"]} currentStep={currentStep} />
        </div>
      </SectionCard>
      {mockState.verifyStatus === "반려" ? <StatusBanner tone="danger" title="서류가 반려되었습니다">회사명·대표자·사업자번호가 제출 서류와 일치하지 않습니다.</StatusBanner> : null}
      <SectionCard>
        <h2 className="text-lg font-black text-ink">제출 서류</h2>
        <p className="mt-2 text-sm text-muted">최근 3개월 이내 발급, 회사명·대표자·사업자번호 일치 필요. 사업자가 없는 개인 의뢰자는 본인 명의 통장 사본으로 대체할 수 있습니다.</p>
        {mockState.verifyStatus !== "미인증" ? <p className="mt-3 text-sm font-semibold text-ink">사업자등록증명원.pdf (2026-07-03 제출)</p> : null}
        <div className="mt-5">
          <FileUpload label="서류 업로드" accept="application/pdf,image/jpeg,image/png" multiple={false} helperText="pdf/jpg/png, 10MB" onChange={(files) => setHasFiles(files.length > 0)} />
        </div>
        <Button className="mt-5" onClick={submit}>
          {mockState.verifyStatus === "반려" ? "서류 다시 제출" : "제출하기"}
        </Button>
        <Button className="mt-2" variant="outline" onClick={completeDemoVerification}>
          데모 인증 완료 후 공고 등록
        </Button>
      </SectionCard>
    </div>
  );
}

function JobsManagePage({ myJobs, setMyJobs, applications, setJumpHistory }: { myJobs: MyJob[]; setMyJobs: (next: MyJob[] | ((current: MyJob[]) => MyJob[])) => void; applications: ApplicationRecord[]; setJumpHistory: (next: JumpHistory[] | ((current: JumpHistory[]) => JumpHistory[])) => void }) {
  const { mockState, setMockState } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState("all");
  const [editing, setEditing] = useState<MyJob | null>(null);
  const tabs = [
    { label: "전체", value: "all" },
    { label: "게시중", value: "게시중" },
    { label: "심사중", value: "심사중" },
    { label: "반려", value: "반려" },
    { label: "마감", value: "마감" },
  ];
  const rows = tab === "all" ? myJobs : myJobs.filter((job) => job.status === tab);

  function manualJump(job: MyJob) {
    if (mockState.jumpCredits <= 0) {
      showToast("점프 크레딧이 부족합니다.", "error");
      return;
    }
    const remaining = mockState.jumpCredits - 1;
    setMockState({ jumpCredits: remaining });
    setMyJobs((current) => current.map((item) => (item.id === job.id ? { ...item, jumpCount: item.jumpCount + 1, updatedAt: new Date().toISOString() } : item)));
    setJumpHistory((current) => [{ id: `jump-${Date.now()}`, jobId: job.id, jobTitle: job.title, type: "수동", usedAt: new Date().toISOString(), remaining }, ...current]);
    showToast("수동 점프가 실행되었습니다.");
  }

  if (myJobs.length === 0) {
    return (
      <EmptyState
        title="등록된 공고가 없습니다"
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/jobs/new" className={linkPrimaryClass}>촬영자 모집 등록</Link>
            <Link href="/editor-jobs/new" className={linkSecondaryClass}>편집자 모집 등록</Link>
          </div>
        }
        className="rounded-md border border-line bg-surface shadow-card"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs items={tabs} value={tab} onChange={setTab} variant="scroll" />
        <div className="flex flex-wrap gap-2">
          <Link href="/jobs/new" className={linkPrimaryClass}>+ 촬영자 모집</Link>
          <Link href="/editor-jobs/new" className={linkSecondaryClass}>+ 편집자 모집</Link>
        </div>
      </div>
      {rows.length > 0 ? (
        <div className="divide-y divide-line rounded-md border border-line bg-surface shadow-card">
          {rows.map((job) => {
            const applicantCount = applications.filter((application) => application.jobId === job.id).length;
            return (
              <div key={job.id} className="grid gap-3 p-4 lg:grid-cols-[110px_minmax(0,1fr)_90px_160px_280px] lg:items-center">
                <Badge label={job.status} />
                <div className="min-w-0">
                  <Link href={`${job.jobType === "editing" ? "/editor-jobs" : "/jobs"}/${job.id}`} className="font-bold text-ink hover:text-primary">
                    {job.title}
                  </Link>
                  {job.status === "반려" ? <p className="mt-1 text-xs text-danger">사유: {job.rejectedReason}</p> : null}
                </div>
                <Link href={`/mypage/applicants?jobId=${job.id}`} className="text-sm font-semibold text-primary">
                  {applicantCount}명
                </Link>
                <div className="text-sm text-muted">
                  <p>{job.deadline}</p>
                  <div className="mt-1 flex gap-1">
                    {job.isPremium ? <Badge label="프리미엄" /> : null}
                    {job.jumpOn ? <Badge label="점프 ON" tone="primary" /> : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(job)}>
                    수정
                  </Button>
                  <Button size="sm" variant="outline" disabled={mockState.jumpCredits <= 0 || job.status !== "게시중"} onClick={() => manualJump(job)}>
                    점프
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setMyJobs((current) => current.map((item) => (item.id === job.id ? { ...item, status: "마감" } : item)))}>
                    마감
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setMyJobs((current) => current.filter((item) => item.id !== job.id))}>
                    삭제
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="해당 상태의 공고가 없습니다" className="rounded-md border border-line bg-surface shadow-card" />
      )}
      <EditJobModal job={editing} onClose={() => setEditing(null)} onSave={(next) => setMyJobs((current) => current.map((item) => (item.id === next.id ? next : item)))} />
    </div>
  );
}

function EditJobModal({ job, onClose, onSave }: { job: MyJob | null; onClose: () => void; onSave: (job: MyJob) => void }) {
  const [draft, setDraft] = useState<MyJob | null>(job);

  useEffect(() => setDraft(job), [job]);

  return (
    <Modal open={Boolean(job && draft)} title="공고 수정" onClose={onClose} size="form">
      {draft ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave(draft);
            onClose();
          }}
        >
          <Input label="제목" value={draft.title} onChange={(event) => setDraft((current) => (current ? { ...current, title: event.target.value } : current))} />
          <Select
            label="상태"
            value={draft.status}
            options={["게시중", "심사중", "반려", "마감"].map((value) => ({ label: value, value }))}
            onChange={(event) => setDraft((current) => (current ? { ...current, status: event.target.value as MyJobStatus } : current))}
          />
          <Input label="마감일" value={draft.deadline} onChange={(event) => setDraft((current) => (current ? { ...current, deadline: event.target.value } : current))} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}

function ApplicantsPage({
  myJobs,
  applications,
  setApplications,
  searchJobId,
}: {
  myJobs: MyJob[];
  applications: ApplicationRecord[];
  setApplications: (next: ApplicationRecord[] | ((current: ApplicationRecord[]) => ApplicationRecord[])) => void;
  searchJobId: string | null;
}) {
  const initialJobId = Number(searchJobId) || myJobs[0]?.id || 0;
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [proposalProfile, setProposalProfile] = useState<ApplicationRecord | null>(null);
  const jobApplications = applications.filter((application) => application.jobId === selectedJobId);
  const selected = jobApplications.find((application) => application.id === selectedApplicationId) ?? jobApplications[0] ?? null;
  const { mockState } = useAuth();

  useEffect(() => {
    if (selected) setSelectedApplicationId(selected.id);
  }, [selected]);

  function markViewed(application: ApplicationRecord) {
    setApplications((current) => current.map((item) => (item.id === application.id ? { ...item, status: "열람됨" as const } : item)));
  }

  if (myJobs.length === 0) {
    return <EmptyState title="지원자를 확인할 공고가 없습니다" className="rounded-md border border-line bg-surface shadow-card" />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
      <SectionCard className="p-3">
        <h2 className="px-1 text-sm font-black text-ink">내 공고</h2>
        <div className="mt-3 space-y-1">
          {myJobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => setSelectedJobId(job.id)}
              className={cn("w-full rounded-sm px-3 py-2 text-left text-sm font-semibold transition", selectedJobId === job.id ? "bg-primary-soft text-primary" : "text-muted hover:bg-page hover:text-ink")}
            >
              <span className="line-clamp-2">{job.title}</span>
              <span className="mt-1 block text-xs">{applications.filter((application) => application.jobId === job.id).length}명</span>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard className="p-0">
        {jobApplications.length > 0 ? (
          <div className="divide-y divide-line">
            {jobApplications.map((application) => {
              const profile = profiles.find((item) => item.id === application.profileId) ?? currentProfile;
              const viewed = application.status === "열람됨";
              return (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => {
                    setSelectedApplicationId(application.id);
                    markViewed(application);
                  }}
                  className={cn("grid w-full gap-2 p-4 text-left text-sm transition hover:bg-page", selected?.id === application.id && "bg-primary-soft/45")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-ink">
                      {profile.maskedName} · {profile.title}
                    </span>
                    <Badge label={viewed ? "확인함" : "미확인"} tone={viewed ? "success" : "warning"} />
                  </div>
                  <span className="text-muted">지원일 {formatDate(application.appliedAt)}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState title="이 공고의 지원자가 없습니다" />
        )}
      </SectionCard>
      <SectionCard>
        {selected ? (
          <ApplicantDetail application={selected} canPropose={mockState.hasContactPass} onPropose={() => setProposalProfile(selected)} />
        ) : (
          <EmptyState title="지원자를 선택해 주세요" className="min-h-40" />
        )}
      </SectionCard>
      <ProposeModal
        open={Boolean(proposalProfile)}
        onClose={() => setProposalProfile(null)}
        receiverName={profiles.find((profile) => profile.id === proposalProfile?.profileId)?.maskedName ?? currentProfile.maskedName}
        profileId={proposalProfile?.profileId ?? currentProfile.id}
      />
    </div>
  );
}

function ApplicantDetail({ application, canPropose, onPropose }: { application: ApplicationRecord; canPropose: boolean; onPropose: () => void }) {
  const profile = profiles.find((item) => item.id === application.profileId) ?? currentProfile;

  return (
    <div>
      <h2 className="text-lg font-black text-ink">지원 상세</h2>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">{application.message || "저장된 지원 내용이 없습니다."}</p>
      <div className="mt-4 rounded-md bg-page p-3 text-sm">
        <p className="font-bold text-ink">{profile.title}</p>
        <p className="mt-1 text-muted">{profile.maskedName} · {profile.region}</p>
        <p className="mt-1 text-primary">{profile.portfolioLinks[0] ?? "포트폴리오 링크 없음"}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/profiles/${profile.id}`} className={linkSecondaryClass}>
          프로필 보기
        </Link>
        <Button disabled={!canPropose} onClick={onPropose}>
          제안 보내기
        </Button>
      </div>
      {!canPropose ? <p className="mt-2 text-xs font-semibold text-warning">열람권 보유 시 제안을 보낼 수 있습니다.</p> : null}
    </div>
  );
}

function ContactPassPage({ contactLogs }: { contactLogs: ContactLog[] }) {
  const { mockState } = useAuth();
  const expiring = isExpiringSoon(mockState.contactPassExpiry);

  if (!mockState.hasContactPass) {
    return <ProductPurchaseCard title="연락처 열람권이 없습니다" description="촬영자 연락처를 확인하고 제안을 보내려면 열람권 구매가 필요합니다." href="/services/order/contact-pass" action="구매하기" />;
  }

  return (
    <div className="space-y-5">
      {expiring ? (
        <StatusBanner
          tone="warning"
          title="열람권 만료가 임박했습니다"
          action={
            <Link href="/services/order/contact-pass" className={linkSecondaryClass}>
              연장 구매
            </Link>
          }
        >
          만료 3일 전부터 warning 상태로 표시됩니다.
        </StatusBanner>
      ) : null}
      <SectionCard>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-muted">현재 이용권</span>
          <Badge label="사용중" tone="success" />
          <span className="text-sm text-muted">{mockState.contactPassExpiry ? `${formatDate(mockState.contactPassExpiry)}까지 (${formatDday(mockState.contactPassExpiry)})` : "제한 없음"}</span>
        </div>
      </SectionCard>
      {contactLogs.length > 0 ? (
        <Table
          rows={contactLogs}
          getRowKey={(row) => row.id}
          columns={[
            { key: "date", header: "날짜", render: (row) => formatDate(row.viewedAt) },
            { key: "profile", header: "촬영자", render: (row) => row.profileName },
            {
              key: "link",
              header: "프로필",
              render: (row) => (
                <Link href={`/profiles/${row.profileId}`} className="font-semibold text-primary">
                  보기
                </Link>
              ),
            },
          ]}
        />
      ) : (
        <EmptyState title="열람 로그가 없습니다" className="rounded-md border border-line bg-surface shadow-card" />
      )}
    </div>
  );
}

function JumpPage({ myJobs, setMyJobs, jumpHistory, setJumpHistory }: { myJobs: MyJob[]; setMyJobs: (next: MyJob[] | ((current: MyJob[]) => MyJob[])) => void; jumpHistory: JumpHistory[]; setJumpHistory: (next: JumpHistory[] | ((current: JumpHistory[]) => JumpHistory[])) => void }) {
  const { mockState, setMockState } = useAuth();
  const { showToast } = useToast();
  const disabled = mockState.jumpCredits <= 0;

  function manualJump(job: MyJob) {
    if (disabled) return;
    const remaining = mockState.jumpCredits - 1;
    setMockState({ jumpCredits: remaining });
    setMyJobs((current) => current.map((item) => (item.id === job.id ? { ...item, jumpCount: item.jumpCount + 1 } : item)));
    setJumpHistory((current) => [{ id: `jump-${Date.now()}`, jobId: job.id, jobTitle: job.title, type: "수동", usedAt: new Date().toISOString(), remaining }, ...current]);
    showToast("수동점프가 실행되었습니다.");
  }

  return (
    <div className="space-y-5">
      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted">보유 크레딧</p>
            <p className="mt-1 text-3xl font-black text-ink">{mockState.jumpCredits}건</p>
          </div>
          <Link href="/services/order/jump" className={linkPrimaryClass}>
            크레딧 구매
          </Link>
        </div>
        <StatusBanner tone="warning" title="구매 후 활성화 필요">자동점프는 구매만으로 작동하지 않고 여기서 공고별로 켜야 합니다.</StatusBanner>
      </SectionCard>
      {disabled ? <StatusBanner tone="warning" title="점프 크레딧이 0건입니다">토글과 수동점프가 비활성화됩니다.</StatusBanner> : null}
      {myJobs.length > 0 ? (
        <Table
          rows={myJobs}
          getRowKey={(row) => String(row.id)}
          columns={[
            { key: "title", header: "공고 제목", render: (row) => row.title },
            {
              key: "toggle",
              header: "자동점프",
              render: (row) => (
                <Toggle
                  checked={row.jumpOn}
                  disabled={disabled}
                  onChange={(checked) => setMyJobs((current) => current.map((item) => (item.id === row.id ? { ...item, jumpOn: checked } : item)))}
                />
              ),
            },
            { key: "next", header: "다음 점프 예정", render: (row) => (row.jumpOn ? "24시간 이내" : "-") },
            { key: "used", header: "누적 사용", render: (row) => `${row.jumpCount}건` },
            {
              key: "manual",
              header: "수동",
              render: (row) => (
                <Button size="sm" variant="outline" disabled={disabled || row.status !== "게시중"} onClick={() => manualJump(row)}>
                  수동점프
                </Button>
              ),
            },
          ]}
        />
      ) : (
        <EmptyState title="자동점프를 설정할 공고가 없습니다" className="rounded-md border border-line bg-surface shadow-card" />
      )}
      {jumpHistory.length > 0 ? (
        <Table
          rows={jumpHistory}
          getRowKey={(row) => row.id}
          columns={[
            { key: "date", header: "날짜", render: (row) => formatDate(row.usedAt) },
            { key: "job", header: "공고", render: (row) => row.jobTitle },
            { key: "type", header: "구분", render: (row) => row.type },
            { key: "remain", header: "잔여", render: (row) => `${row.remaining}건` },
          ]}
        />
      ) : (
        <EmptyState title="점프 사용 내역이 없습니다" className="rounded-md border border-line bg-surface shadow-card" />
      )}
    </div>
  );
}

function BannersPage({ bannerState, setBannerState }: { bannerState: BannerState; setBannerState: (next: BannerState | ((current: BannerState) => BannerState)) => void }) {
  const { mockState } = useAuth();
  const { showToast } = useToast();
  const [url, setUrl] = useState(bannerState.clickUrl);

  if (!mockState.hasBanner) {
    return <ProductPurchaseCard title="프리미엄 배너 상품이 없습니다" description="메인 상단 배너 영역에 집행되는 유료 광고 상품입니다." href="/services/order/banner" action="신청하기" />;
  }

  return (
    <div className="space-y-5">
      <SectionCard>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-muted">현재 배너</span>
          <Badge label={mockState.bannerStatus ?? "집행중"} tone="success" />
          <span className="text-sm text-muted">2026-07-01 ~ 2026-07-31 · 메인 상단 · 클릭 {bannerState.clicks}회</span>
        </div>
        <div className="mt-5 aspect-[940/230] rounded-md border border-dashed border-line bg-page p-5">
          <div className="flex h-full items-center justify-center rounded-sm bg-surface text-sm font-bold text-muted">940×230 배너 소재 미리보기</div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted">소재</span>
          <Badge label={bannerState.creativeStatus} />
          <Button size="sm" variant="outline" onClick={() => setBannerState((current) => ({ ...current, creativeStatus: "검수중" }))}>
            소재 교체
          </Button>
        </div>
      </SectionCard>
      <SectionCard>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <Input label="클릭 URL" value={url} onChange={(event) => setUrl(event.target.value)} />
          <Button
            onClick={() => {
              setBannerState((current) => ({ ...current, clickUrl: url }));
              showToast("클릭 URL이 저장되었습니다.");
            }}
          >
            저장
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
