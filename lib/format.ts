const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(toDate(value));
}

export function formatDday(deadline?: string | Date, baseDate: string | Date = new Date()) {
  if (!deadline) return "상시";
  const end = toDate(deadline);
  const base = toDate(baseDate);
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  const baseUtc = Date.UTC(base.getFullYear(), base.getMonth(), base.getDate());
  const diff = Math.ceil((endUtc - baseUtc) / DAY_MS);
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-day";
  return "마감";
}

export function formatKrw(amount: number) {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}

export function maskName(name: string) {
  if (!name || name.includes("O") || name.startsWith("팀 ") || name.startsWith("스튜디오 ")) {
    return name;
  }
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + "O";
  return name[0] + "O" + name.slice(2);
}
