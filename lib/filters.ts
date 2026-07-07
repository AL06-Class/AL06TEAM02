export type SortDirection = "asc" | "desc";

export type FilterMode = "equals" | "includes";

export interface FilterConfig<T> {
  param: string;
  key: keyof T;
  mode?: FilterMode;
  multiple?: boolean;
  match?: (itemValue: T[keyof T], queryValues: string[], item: T) => boolean;
}

export interface SortConfig<T> {
  key: keyof T;
  direction?: SortDirection;
  compare?: (a: T, b: T) => number;
}

export interface PageSlice<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  start: number;
  end: number;
}

export type SearchParamsInput = URLSearchParams | Record<string, string | string[] | undefined>;

export interface ListQueryOptions<T> {
  filters?: FilterConfig<T>[];
  sort?: SortConfig<T>;
  defaultPage?: number;
  defaultPageSize?: number;
}

export function toURLSearchParams(params: SearchParamsInput) {
  if (params instanceof URLSearchParams) return params;
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) next.append(key, item);
    } else if (value !== undefined) {
      next.set(key, value);
    }
  }
  return next;
}

export function getParamValues(params: URLSearchParams, key: string) {
  const values = params.getAll(key).flatMap((value) => value.split(","));
  return values.map((value) => value.trim()).filter(Boolean);
}

function defaultMatch<T>(itemValue: T[keyof T], queryValues: string[], mode: FilterMode) {
  const values = Array.isArray(itemValue) ? itemValue.map(String) : [String(itemValue ?? "")];
  if (mode === "includes") {
    return queryValues.some((query) => values.some((value) => value.includes(query)));
  }
  return queryValues.some((query) => values.includes(query));
}

export function getParam(paramsInput: SearchParamsInput, key: string) {
  return toURLSearchParams(paramsInput).get(key) ?? "";
}

export function filterItems<T>(items: T[], paramsInput: SearchParamsInput, filters: FilterConfig<T>[] = []) {
  const params = toURLSearchParams(paramsInput);
  return items.filter((item) => filters.every((filter) => {
    const queryValues = getParamValues(params, filter.param);
    if (queryValues.length === 0) return true;
    const itemValue = item[filter.key];
    if (filter.match) return filter.match(itemValue, queryValues, item);
    return defaultMatch(itemValue, filter.multiple ? queryValues : queryValues.slice(0, 1), filter.mode ?? "equals");
  }));
}

export function sortItems<T>(items: T[], sort?: SortConfig<T>) {
  if (!sort) return [...items];
  const direction = sort.direction === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (sort.compare) return sort.compare(a, b) * direction;
    const left = a[sort.key];
    const right = b[sort.key];
    if (left === right) return 0;
    return String(left ?? "").localeCompare(String(right ?? ""), "ko-KR", { numeric: true }) * direction;
  });
}

export function pageSlice<T>(items: T[], paramsInput: SearchParamsInput, defaultPageSize = 10, defaultPage = 1): PageSlice<T> {
  const params = toURLSearchParams(paramsInput);
  const page = Math.max(Number(params.get("page") ?? defaultPage) || defaultPage, 1);
  const pageSize = Math.max(Number(params.get("pageSize") ?? defaultPageSize) || defaultPageSize, 1);
  const totalItems = items.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    start,
    end: Math.min(end, totalItems),
  };
}

export function applyListQuery<T>(items: T[], paramsInput: SearchParamsInput, options: ListQueryOptions<T> = {}) {
  const filtered = filterItems(items, paramsInput, options.filters);
  const sorted = sortItems(filtered, options.sort);
  return pageSlice(sorted, paramsInput, options.defaultPageSize, options.defaultPage);
}

export const SHOOTING_CATEGORIES = [
  "브랜드/광고 촬영",
  "유튜브/채널 촬영",
  "숏폼/Reels/TikTok",
  "웨딩",
  "행사/컨퍼런스",
  "제품/커머스",
  "인터뷰/다큐",
  "라이브/스트리밍",
  "드론",
  "스튜디오",
  "부동산/공간",
  "뷰티/패션",
  "교육/강의",
  "스포츠/공연",
] as const;

export const EQUIPMENT_OPTIONS = [
  "시네마 카메라",
  "렌즈 세트",
  "색보정 가능",
  "DSLR/미러리스",
  "짐벌",
  "편집 가능",
  "무선마이크/붐마이크",
  "조명",
  "사진 촬영 가능",
  "라이브 송출 장비",
  "드론",
  "프롬프터",
  "스튜디오 보유",
] as const;

export const CAREER_OPTIONS = ["신입", "1년 이상", "3년 이상", "5년 이상", "10년 이상", "경력무관"] as const;

export const JOB_SORT_OPTIONS = [
  { label: "등록일순", value: "recent" },
  { label: "마감임박순", value: "deadline" },
  { label: "조회수순", value: "views" },
  { label: "스크랩순", value: "scraps" },
] as const;

export const PROFILE_SORT_OPTIONS = [
  { label: "수정일순", value: "recent" },
  { label: "추천순", value: "recommended" },
  { label: "경력순", value: "career" },
  { label: "단가낮은순", value: "pay-low" },
] as const;

interface JobFilterable {
  companyName: string;
  title: string;
  category: string;
  region: string;
  subwayArea?: string;
  careerLevel: string;
  equipment: string[];
  payAmount: string;
  deadline?: string;
  isPremium: boolean;
  status: string;
  description: string;
  createdAt: string;
  views: number;
  scrapCount: number;
}

interface ProfileFilterable {
  maskedName: string;
  title: string;
  region: string;
  categories: string[];
  equipment: string[];
  desiredPay: string;
  careerYears: number;
  gender?: string;
  intro: string;
  isRecommended: boolean;
  updatedAt: string;
}

function textIncludes(value: string | undefined, query: string) {
  return (value ?? "").toLocaleLowerCase("ko-KR").includes(query.toLocaleLowerCase("ko-KR"));
}

function matchesAny(values: string[], selected: string[]) {
  if (selected.length === 0) return true;
  return selected.some((value) => values.includes(value));
}

function careerYearsForLabel(label: string) {
  if (label === "신입") return 0;
  if (label === "경력무관") return -1;
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function parseMoney(value: string) {
  const match = value.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function compareDate(left?: string, right?: string) {
  const leftTime = left ? new Date(left).getTime() : Number.POSITIVE_INFINITY;
  const rightTime = right ? new Date(right).getTime() : Number.POSITIVE_INFINITY;
  return leftTime - rightTime;
}

export function filterJobPostings<T extends JobFilterable>(items: T[], paramsInput: SearchParamsInput) {
  const params = toURLSearchParams(paramsInput);
  const categories = getParamValues(params, "category");
  const regions = getParamValues(params, "region");
  const subways = getParamValues(params, "subway");
  const career = params.get("career") ?? "";
  const includeAnyCareer = params.get("includeAnyCareer") === "1";
  const equipment = getParamValues(params, "equipment");
  const query = (params.get("q") ?? "").trim();
  const scope = params.get("scope") ?? "all";

  return items.filter((job) => {
    if (!matchesAny([job.category], categories)) return false;
    if (regions.length > 0 && !regions.some((region) => job.region.includes(region))) return false;
    if (subways.length > 0 && !subways.some((subway) => job.subwayArea === subway)) return false;
    if (equipment.length > 0 && !equipment.some((item) => job.equipment.includes(item))) return false;
    if (career && job.careerLevel !== career && !(includeAnyCareer && job.careerLevel === "경력무관")) return false;
    if (!query) return true;

    if (scope === "company") return textIncludes(job.companyName, query);
    if (scope === "title") return textIncludes(job.title, query);
    return [
      job.companyName,
      job.title,
      job.category,
      job.region,
      job.payAmount,
      job.description,
      ...job.equipment,
    ].some((value) => textIncludes(value, query));
  });
}

export function sortJobPostings<T extends JobFilterable>(items: T[], sortValue = "recent") {
  return [...items].sort((left, right) => {
    if (sortValue === "deadline") return compareDate(left.deadline, right.deadline);
    if (sortValue === "views") return right.views - left.views;
    if (sortValue === "scraps") return right.scrapCount - left.scrapCount;
    if (left.isPremium !== right.isPremium) return Number(right.isPremium) - Number(left.isPremium);
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export function queryJobPostings<T extends JobFilterable>(items: T[], paramsInput: SearchParamsInput, pageSize = 20) {
  const params = toURLSearchParams(paramsInput);
  const filtered = filterJobPostings(items, params);
  const sorted = sortJobPostings(filtered, params.get("sort") ?? "recent");
  return pageSlice(sorted, params, pageSize);
}

export function filterShooterProfiles<T extends ProfileFilterable>(items: T[], paramsInput: SearchParamsInput) {
  const params = toURLSearchParams(paramsInput);
  const categories = getParamValues(params, "category");
  const regions = getParamValues(params, "region");
  const equipment = getParamValues(params, "equipment");
  const career = params.get("career") ?? "";
  const pay = params.get("pay") ?? "";
  const gender = params.get("gender") ?? "";
  const query = (params.get("q") ?? "").trim();

  return items.filter((profile) => {
    if (!matchesAny(profile.categories, categories)) return false;
    if (regions.length > 0 && !regions.some((region) => profile.region.includes(region))) return false;
    if (equipment.length > 0 && !equipment.some((item) => profile.equipment.includes(item))) return false;
    if (gender && profile.gender !== gender) return false;
    if (career && profile.careerYears < careerYearsForLabel(career)) return false;
    if (pay && parseMoney(profile.desiredPay) > Number(pay)) return false;
    if (!query) return true;

    return [
      profile.maskedName,
      profile.title,
      profile.region,
      profile.desiredPay,
      profile.intro,
      ...profile.categories,
      ...profile.equipment,
    ].some((value) => textIncludes(value, query));
  });
}

export function sortShooterProfiles<T extends ProfileFilterable>(items: T[], sortValue = "recent") {
  return [...items].sort((left, right) => {
    if (sortValue === "recommended") {
      if (left.isRecommended !== right.isRecommended) return Number(right.isRecommended) - Number(left.isRecommended);
    }
    if (sortValue === "career") return right.careerYears - left.careerYears;
    if (sortValue === "pay-low") return parseMoney(left.desiredPay) - parseMoney(right.desiredPay);
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

export function queryShooterProfiles<T extends ProfileFilterable>(items: T[], paramsInput: SearchParamsInput, pageSize = 12) {
  const params = toURLSearchParams(paramsInput);
  const filtered = filterShooterProfiles(items, params);
  const sorted = sortShooterProfiles(filtered, params.get("sort") ?? "recent");
  return pageSlice(sorted, params, pageSize);
}
