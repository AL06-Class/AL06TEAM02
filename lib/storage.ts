export const storageKeys = {
  role: "shootmon:role",
  mockState: "shootmon:mock-state",
  jobScraps: "shootmon:scrap:jobs",
  profileScraps: "shootmon:scrap:profiles",
  applications: "shootmon:applications",
  payments: "shootmon:payments",
  proposals: "shootmon:proposals",
  viewMode: "shootmon:view-mode",
} as const;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readStorageString(key: string, fallback = "") {
  if (!canUseStorage()) return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

export function writeStorageString(key: string, value: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, value);
}

export function readStorageJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorageJSON<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function appendStorageItem<T>(key: string, item: T) {
  const current = readStorageJSON<T[]>(key, []);
  const next = [...current, item];
  writeStorageJSON(key, next);
  return next;
}
