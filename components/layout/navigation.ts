export const mainNavItems = [
  { label: "촬영자 모집", href: "/jobs" },
  { label: "편집자 모집", href: "/editor-jobs" },
  { label: "촬영자 프로필", href: "/profiles" },
  { label: "커뮤니티", href: "/community" },
  { label: "공지사항", href: "/notice" },
  { label: "스토어", href: "/store" },
  { label: "스토어 등록", href: "/store/new" },
];

export const mobileTabItems = [
  { label: "촬영자 모집", href: "/jobs" },
  { label: "편집자 모집", href: "/editor-jobs" },
  { label: "촬영자 프로필", href: "/profiles" },
  { label: "커뮤니티", href: "/community" },
  { label: "공지사항", href: "/notice" },
];

export const utilityItems = [
  { label: "광고배너 안내", href: "/ads" },
  { label: "서비스안내", href: "/services" },
  { label: "마이페이지", href: "/mypage" },
  { label: "고객센터", href: "/support" },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
