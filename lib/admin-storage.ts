import { companyMembers, personalMembers } from "@/data/members";
import { jobs } from "@/data/jobs";
import { profiles } from "@/data/profiles";
import { products } from "@/data/products";
import { readStorageJSON, storageKeys, writeStorageJSON } from "@/lib/storage";

export type VerifyStatus = "미인증" | "검수중" | "인증완료" | "반려";
export type AdminJobStatus = "심사중" | "게시중" | "반려" | "마감" | "비공개";
export type AdminProfileStatus = "검수중" | "공개" | "반려" | "비공개";
export type ReportStatus = "접수" | "검토중" | "조치완료" | "반려";
export type ReportTargetType = "공고" | "프로필" | "게시글" | "댓글" | "상품";

export interface StatusOverride<TStatus extends string> {
  status: TStatus;
  reason?: string;
  action?: string;
  updatedAt: string;
}

export interface SubmittedJobRecord {
  id: number;
  jobType?: "shooting" | "editing";
  companyName: string;
  title: string;
  category: string;
  career: string;
  equipment: string[];
  editingTools?: string[];
  shootingCategories?: string[];
  employmentType: string;
  payType: string;
  payAmount: string;
  deadlineType: "마감일" | "상시채용" | "채용시까지";
  deadline: string;
  managerName: string;
  managerEmail: string;
  description: string;
  address: string;
  premium: boolean;
  autoJump: boolean;
  status: AdminJobStatus;
  createdAt: string;
}

export interface SubmittedProfileRecord {
  id: number;
  title: string;
  visibility: string;
  categories: string[];
  equipment: string[];
  desiredPay: string;
  region: string;
  travelAvailable: boolean;
  hasStudio: boolean;
  careers: Array<{ id: string; period: string; title: string }>;
  portfolioLinks: Array<{ id: string; type: string; url: string }>;
  portfolioImageFileNames: string[];
  status: AdminProfileStatus;
  submittedAt: string;
}

export interface AdminVerificationRecord {
  id: number;
  companyName: string;
  ceoName: string;
  bizNumber: string;
  email: string;
  status: VerifyStatus;
  requestedAt: string;
  reason?: string;
}

export interface AdminJobRecord {
  id: number;
  jobType?: "shooting" | "editing";
  source: "data" | "submitted";
  companyName: string;
  title: string;
  category: string;
  region: string;
  careerLevel: string;
  equipment: string[];
  editingTools?: string[];
  shootingCategories?: string[];
  employmentType: string;
  payAmount: string;
  deadlineType: string;
  deadline?: string;
  isPremium: boolean;
  status: AdminJobStatus;
  managerName: string;
  managerEmail: string;
  address: string;
  description: string;
  createdAt: string;
  reason?: string;
}

export interface AdminProfileRecord {
  id: number;
  source: "data" | "submitted";
  maskedName: string;
  title: string;
  region: string;
  categories: string[];
  equipment: string[];
  desiredPay: string;
  careerYears: number;
  careerHistory: string[];
  status: AdminProfileStatus;
  portfolioImages: string[];
  portfolioLinks: string[];
  email: string;
  phone: string;
  submittedAt: string;
  reason?: string;
}

export interface AdminReportRecord {
  id: string;
  status: ReportStatus;
  targetType: ReportTargetType;
  targetUrl: string;
  targetTitle: string;
  reason: string;
  detail: string;
  reporter: string;
  receivedAt: string;
  action?: string;
  rejectReason?: string;
}

export interface AdminPaymentRecord {
  id: string;
  member: string;
  productName: string;
  optionLabel?: string;
  amount: number;
  paidAt: string;
  status?: string;
}

export interface AdminAuditLog {
  id: string;
  domain: string;
  targetId: string;
  action: string;
  reason?: string;
  createdAt: string;
}

const currentCompany = companyMembers[0];
const currentPersonal = personalMembers[0];
const profilePlaceholder = "/images/presets/placeholders/shootmon-placeholder-profile-01.svg";
const jobPlaceholder = "/images/presets/placeholders/shootmon-placeholder-camera-01.svg";

function nowIso() {
  return new Date().toISOString();
}

function readOverrideMap<TStatus extends string>(key: string) {
  return readStorageJSON<Record<string, StatusOverride<TStatus>>>(key, {});
}

function writeOverride<TStatus extends string>(key: string, id: number | string, status: TStatus, reason?: string, action?: string) {
  const current = readOverrideMap<TStatus>(key);
  writeStorageJSON(key, {
    ...current,
    [String(id)]: { status, reason, action, updatedAt: nowIso() },
  });
}

export function addAdminAuditLog(domain: string, targetId: number | string, action: string, reason?: string) {
  const current = readStorageJSON<AdminAuditLog[]>(storageKeys.adminAuditLogs, []);
  writeStorageJSON(storageKeys.adminAuditLogs, [
    { id: `audit-${Date.now()}`, domain, targetId: String(targetId), action, reason, createdAt: nowIso() },
    ...current,
  ]);
}

export function readSubmittedJobs() {
  return readStorageJSON<SubmittedJobRecord[]>(storageKeys.submittedJobs, []);
}

export function readSubmittedProfiles() {
  return readStorageJSON<SubmittedProfileRecord[]>(storageKeys.submittedProfiles, []);
}

function readMockVerifyStatus() {
  return readStorageJSON<{ verifyStatus?: VerifyStatus }>(storageKeys.mockState, {}).verifyStatus;
}

function writeMockVerifyStatus(status: VerifyStatus) {
  const current = readStorageJSON<Record<string, unknown>>(storageKeys.mockState, {});
  writeStorageJSON(storageKeys.mockState, { ...current, verifyStatus: status });
}

export function getVerificationRows(): AdminVerificationRecord[] {
  const overrides = readOverrideMap<VerifyStatus>(storageKeys.adminVerificationStatuses);
  const mockStatus = readMockVerifyStatus();
  return companyMembers.map((company) => {
    const override = overrides[String(company.id)];
    const status = company.id === currentCompany.id ? (override?.status ?? mockStatus ?? company.verifyStatus) : (override?.status ?? company.verifyStatus);
    return {
      id: company.id,
      companyName: company.companyName,
      ceoName: company.ceoName,
      bizNumber: company.bizNumber,
      email: company.email,
      status,
      requestedAt: override?.updatedAt ?? company.joinedAt,
      reason: override?.reason,
    };
  });
}

export function updateVerificationStatus(id: number, status: VerifyStatus, reason?: string) {
  writeOverride(storageKeys.adminVerificationStatuses, id, status, reason);
  if (id === currentCompany.id) writeMockVerifyStatus(status);
  addAdminAuditLog("verification", id, status, reason);
}

function submittedJobToAdmin(job: SubmittedJobRecord, override?: StatusOverride<AdminJobStatus>): AdminJobRecord {
  const status = override?.status ?? job.status;
  return {
    id: job.id,
    jobType: job.jobType ?? "shooting",
    source: "submitted",
    companyName: job.companyName,
    title: job.title,
    category: job.category,
    region: job.address,
    careerLevel: job.career || "경력무관",
    equipment: job.equipment,
    editingTools: job.editingTools,
    shootingCategories: job.shootingCategories,
    employmentType: job.employmentType,
    payAmount: job.payType === "협의" ? "협의" : `${job.payType} ${job.payAmount || "협의"}`,
    deadlineType: job.deadlineType,
    deadline: job.deadline || undefined,
    isPremium: job.premium,
    status,
    managerName: job.managerName,
    managerEmail: job.managerEmail,
    address: job.address,
    description: job.description || "상세 내용 미입력",
    createdAt: job.createdAt,
    reason: override?.reason,
  };
}

export function getJobRows(): AdminJobRecord[] {
  const overrides = readOverrideMap<AdminJobStatus>(storageKeys.adminJobStatuses);
  const submitted = readSubmittedJobs().map((job) => submittedJobToAdmin(job, overrides[String(job.id)]));
  const staticRows = jobs.map<AdminJobRecord>((job, index) => {
    const override = overrides[String(job.id)];
    const demoStatus: AdminJobStatus = job.companyName === currentCompany.companyName && index === 1 ? "심사중" : job.status === "마감" ? "마감" : "게시중";
    return {
      id: job.id,
      jobType: "shooting",
      source: "data",
      companyName: job.companyName,
      title: job.title,
      category: job.category,
      region: job.region,
      careerLevel: job.careerLevel,
      equipment: job.equipment,
      editingTools: job.editingTools,
      shootingCategories: job.shootingCategories,
      employmentType: job.employmentType,
      payAmount: job.payAmount,
      deadlineType: job.deadlineType,
      deadline: job.deadline,
      isPremium: job.isPremium,
      status: override?.status ?? demoStatus,
      managerName: job.managerName,
      managerEmail: job.managerEmail,
      address: job.address,
      description: job.description,
      createdAt: override?.updatedAt ?? job.createdAt,
      reason: override?.reason,
    };
  });
  return [...submitted, ...staticRows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function updateJobStatus(id: number, status: AdminJobStatus, reason?: string) {
  writeOverride(storageKeys.adminJobStatuses, id, status, reason);
  const submitted = readSubmittedJobs();
  writeStorageJSON(
    storageKeys.submittedJobs,
    submitted.map((job) => (job.id === id ? { ...job, status } : job)),
  );
  const myJobs = readStorageJSON<Array<Record<string, unknown>>>(storageKeys.mypageJobs, []);
  writeStorageJSON(
    storageKeys.mypageJobs,
    myJobs.map((job) => (job.id === id ? { ...job, status, rejectedReason: reason, updatedAt: nowIso() } : job)),
  );
  addAdminAuditLog("job", id, status, reason);
}

function submittedProfileToAdmin(profile: SubmittedProfileRecord, override?: StatusOverride<AdminProfileStatus>): AdminProfileRecord {
  const status = override?.status ?? profile.status;
  const careers = profile.careers.map((item) => [item.period, item.title].filter(Boolean).join(" ")).filter(Boolean);
  return {
    id: profile.id,
    source: "submitted",
    maskedName: currentPersonal.maskedName,
    title: profile.title,
    region: profile.region,
    categories: profile.categories,
    equipment: profile.equipment,
    desiredPay: profile.desiredPay,
    careerYears: Math.max(careers.length, 1),
    careerHistory: careers.length > 0 ? careers : ["경력 입력 없음"],
    status,
    portfolioImages: profile.portfolioImageFileNames.length > 0 ? profile.portfolioImageFileNames.map(() => profilePlaceholder) : [profilePlaceholder],
    portfolioLinks: profile.portfolioLinks.map((item) => item.url).filter(Boolean),
    email: currentPersonal.email,
    phone: "010-1234-5678",
    submittedAt: profile.submittedAt,
    reason: override?.reason,
  };
}

export function getProfileRows(): AdminProfileRecord[] {
  const overrides = readOverrideMap<AdminProfileStatus>(storageKeys.adminProfileStatuses);
  const submitted = readSubmittedProfiles().map((profile) => submittedProfileToAdmin(profile, overrides[String(profile.id)]));
  const staticRows = profiles.map<AdminProfileRecord>((profile) => {
    const override = overrides[String(profile.id)];
    return {
      id: profile.id,
      source: "data",
      maskedName: profile.maskedName,
      title: profile.title,
      region: profile.region,
      categories: profile.categories,
      equipment: profile.equipment,
      desiredPay: profile.desiredPay,
      careerYears: profile.careerYears,
      careerHistory: profile.careerHistory,
      status: override?.status ?? "공개",
      portfolioImages: profile.portfolioImages,
      portfolioLinks: profile.portfolioLinks,
      email: `profile${String(profile.id).padStart(2, "0")}@shootmon.example.kr`,
      phone: `010-45${String(profile.id).padStart(2, "0")}-78${String(profile.id).padStart(2, "0")}`,
      submittedAt: override?.updatedAt ?? profile.updatedAt,
      reason: override?.reason,
    };
  });
  return [...submitted, ...staticRows].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function updateProfileStatus(id: number, status: AdminProfileStatus, reason?: string) {
  writeOverride(storageKeys.adminProfileStatuses, id, status, reason);
  const submitted = readSubmittedProfiles();
  writeStorageJSON(
    storageKeys.submittedProfiles,
    submitted.map((profile) => (profile.id === id ? { ...profile, status } : profile)),
  );
  const currentProfile = readStorageJSON<Record<string, unknown>>(storageKeys.mypageProfile, {});
  if (submitted.some((profile) => profile.id === id)) {
    writeStorageJSON(storageKeys.mypageProfile, {
      ...currentProfile,
      hasProfile: true,
      isPublic: status === "공개",
      reviewStatus: status === "비공개" ? "공개" : status,
      rejectedReason: reason ?? "",
    });
  }
  addAdminAuditLog("profile", id, status, reason);
}

export function getReports(): AdminReportRecord[] {
  const stored = readStorageJSON<AdminReportRecord[]>(storageKeys.reports, []);
  if (stored.length > 0) return stored;
  return [
    {
      id: "report-demo-1",
      status: "접수",
      targetType: "공고",
      targetUrl: "/jobs/3",
      targetTitle: "브랜드 숏폼 릴스 촬영자 모집",
      reason: "낮은 임금/부당 페이",
      detail: "작업 범위 대비 조건 확인이 필요합니다.",
      reporter: "홍O민",
      receivedAt: "2026-07-06T09:00:00.000Z",
    },
    {
      id: "report-demo-2",
      status: "검토중",
      targetType: "프로필",
      targetUrl: "/profiles/12",
      targetTitle: "B캠/촬영 보조 성실히 배우겠습니다",
      reason: "잘못 기재된 연락처",
      detail: "연락처가 반복 반송됩니다.",
      reporter: "촬영몬스튜디오",
      receivedAt: "2026-07-06T11:30:00.000Z",
    },
  ];
}

export function writeReports(reports: AdminReportRecord[]) {
  writeStorageJSON(storageKeys.reports, reports);
}

export function updateReportStatus(id: string, status: ReportStatus, reason?: string, action?: string) {
  const reports = getReports().map((report) =>
    report.id === id
      ? { ...report, status, rejectReason: status === "반려" ? reason : report.rejectReason, action: action ?? report.action }
      : report,
  );
  writeReports(reports);
  addAdminAuditLog("report", id, status, reason ?? action);
}

export function getRecentPayments(): AdminPaymentRecord[] {
  const stored = readStorageJSON<AdminPaymentRecord[]>(storageKeys.payments, []);
  if (stored.length > 0) {
    return stored.map((payment, index) => ({
      ...payment,
      member: payment.member ?? (index % 2 === 0 ? currentCompany.companyName : currentPersonal.maskedName),
      status: payment.status ?? "결제완료",
    }));
  }
  return [
    { id: "pay-demo-1", member: currentCompany.companyName, productName: "프리미엄 배너", optionLabel: "1개월", amount: 69000, paidAt: "2026-07-06T14:20:00.000Z", status: "결제완료" },
    { id: "pay-demo-2", member: currentPersonal.maskedName, productName: "추천 프로필", optionLabel: "1개월", amount: 25000, paidAt: "2026-07-06T10:15:00.000Z", status: "결제완료" },
    { id: "pay-demo-3", member: currentCompany.companyName, productName: "자동점프", optionLabel: "30건", amount: 33000, paidAt: "2026-07-05T18:40:00.000Z", status: "결제완료" },
    { id: "pay-demo-4", member: currentCompany.companyName, productName: "연락처 열람권", optionLabel: "1주", amount: 27000, paidAt: "2026-07-05T12:10:00.000Z", status: "사용중" },
    { id: "pay-demo-5", member: currentPersonal.maskedName, productName: "스토어 등록", optionLabel: "데모", amount: 0, paidAt: "2026-07-04T16:00:00.000Z", status: "결제완료" },
  ];
}

export function getStorePendingCount() {
  const stored = readStorageJSON<Array<{ id: number | string; status?: string }>>(storageKeys.storeProducts, []);
  const statuses = readStorageJSON<Record<string, string>>(storageKeys.mypageProductStatuses, {});
  const storedPending = stored.filter((product) => (statuses[String(product.id)] ?? product.status ?? "검수중") === "검수중").length;
  const dataPending = products.filter((product) => product.id % 4 === 0).length;
  return storedPending + dataPending;
}

export function toPublicSubmittedJobs() {
  const overrides = readOverrideMap<AdminJobStatus>(storageKeys.adminJobStatuses);
  return readSubmittedJobs()
    .filter((job) => !job.jobType || job.jobType === "shooting")
    .map((job) => submittedJobToAdmin(job, overrides[String(job.id)]))
    .filter((job) => job.status === "게시중")
    .map((job) => ({
      id: job.id,
      companyName: job.companyName,
      title: job.title,
      category: job.category,
      region: job.region,
      subwayArea: undefined,
      careerLevel: job.careerLevel,
      equipment: job.equipment,
      editingTools: job.editingTools,
      shootingCategories: job.shootingCategories,
      employmentType: job.employmentType,
      payType: job.payAmount.startsWith("협의") ? "협의" : "건당",
      payAmount: job.payAmount,
      deadlineType: job.deadlineType,
      deadline: job.deadline,
      isPremium: job.isPremium,
      status: job.status,
      applyMethods: ["온라인"],
      managerName: job.managerName,
      managerEmail: job.managerEmail,
      address: job.address,
      description: job.description,
      image: jobPlaceholder,
      createdAt: job.createdAt,
      views: 0,
      scrapCount: 0,
    }));
}

export function toPublicSubmittedEditorJobs() {
  const overrides = readOverrideMap<AdminJobStatus>(storageKeys.adminJobStatuses);
  return readSubmittedJobs()
    .filter((job) => job.jobType === "editing")
    .map((job) => submittedJobToAdmin(job, overrides[String(job.id)]))
    .filter((job) => job.status === "게시중")
    .map((job) => ({
      id: job.id,
      companyName: job.companyName,
      title: job.title,
      category: job.category,
      region: job.region,
      subwayArea: undefined,
      careerLevel: job.careerLevel,
      equipment: job.equipment,
      editingTools: job.editingTools ?? job.equipment,
      shootingCategories: job.shootingCategories ?? [],
      employmentType: job.employmentType,
      payType: job.payAmount.startsWith("협의") ? "협의" : "건당",
      payAmount: job.payAmount,
      deadlineType: job.deadlineType,
      deadline: job.deadline,
      isPremium: job.isPremium,
      status: job.status,
      applyMethods: ["온라인"],
      managerName: job.managerName,
      managerEmail: job.managerEmail,
      address: job.address,
      description: job.description,
      image: jobPlaceholder,
      createdAt: job.createdAt,
      views: 0,
      scrapCount: 0,
    }));
}

export function toPublicSubmittedProfiles() {
  const overrides = readOverrideMap<AdminProfileStatus>(storageKeys.adminProfileStatuses);
  return readSubmittedProfiles()
    .map((profile) => submittedProfileToAdmin(profile, overrides[String(profile.id)]))
    .filter((profile) => profile.status === "공개")
    .map((profile) => ({
      id: profile.id,
      maskedName: profile.maskedName,
      gender: undefined,
      birthYear: undefined,
      title: profile.title,
      region: profile.region,
      categories: profile.categories,
      equipment: profile.equipment,
      desiredPay: profile.desiredPay,
      careerYears: profile.careerYears,
      careerHistory: profile.careerHistory,
      education: undefined,
      status: "활동가능",
      travelAvailable: true,
      hasStudio: false,
      portfolioImages: profile.portfolioImages,
      portfolioLinks: profile.portfolioLinks,
      isRecommended: false,
      avatar: profilePlaceholder,
      cover: profilePlaceholder,
      intro: profile.careerHistory.join(" "),
      updatedAt: profile.submittedAt,
    }));
}
