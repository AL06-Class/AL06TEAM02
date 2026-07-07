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

export interface ListQueryOptions<T> {
  filters?: FilterConfig<T>[];
  sort?: SortConfig<T>;
  defaultPage?: number;
  defaultPageSize?: number;
}

function normalizeParams(params: URLSearchParams | Record<string, string | string[] | undefined>) {
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

export function filterItems<T>(items: T[], paramsInput: URLSearchParams | Record<string, string | string[] | undefined>, filters: FilterConfig<T>[] = []) {
  const params = normalizeParams(paramsInput);
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

export function pageSlice<T>(items: T[], paramsInput: URLSearchParams | Record<string, string | string[] | undefined>, defaultPageSize = 10, defaultPage = 1): PageSlice<T> {
  const params = normalizeParams(paramsInput);
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

export function applyListQuery<T>(items: T[], paramsInput: URLSearchParams | Record<string, string | string[] | undefined>, options: ListQueryOptions<T> = {}) {
  const filtered = filterItems(items, paramsInput, options.filters);
  const sorted = sortItems(filtered, options.sort);
  return pageSlice(sorted, paramsInput, options.defaultPageSize, options.defaultPage);
}
