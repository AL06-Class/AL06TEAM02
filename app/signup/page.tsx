import Link from "next/link";
import { Building2, Camera } from "lucide-react";

interface SignupPageProps {
  searchParams?: { redirect?: string | string[] };
}

function redirectQuery(value?: string | string[]) {
  const redirect = Array.isArray(value) ? value[0] : value;
  return redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";
}

const cardClass = "rounded-md border border-line bg-surface p-6 shadow-card transition hover:border-primary";

export default function SignupPage({ searchParams = {} }: SignupPageProps) {
  const query = redirectQuery(searchParams.redirect);

  return (
    <div className="mx-auto max-w-[820px] space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">회원가입</h1>
        <p className="mt-2 text-sm text-muted">활동 목적에 맞는 회원 유형을 선택하세요.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href={`/signup/personal${query}`} className={cardClass}>
          <Camera aria-hidden className="h-9 w-9 text-primary" />
          <h2 className="mt-4 text-xl font-black text-ink">개인회원</h2>
          <p className="mt-2 text-sm leading-6 text-muted">촬영자로 활동하고 프로필 등록, 공고 지원을 이용합니다.</p>
          <span className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white">
            개인회원 가입
          </span>
        </Link>
        <Link href={`/signup/company${query}`} className={cardClass}>
          <Building2 aria-hidden className="h-9 w-9 text-primary" />
          <h2 className="mt-4 text-xl font-black text-ink">기업회원/의뢰자</h2>
          <p className="mt-2 text-sm leading-6 text-muted">촬영자를 찾고 공고 등록, 지원자 관리를 이용합니다.</p>
          <span className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white">
            기업회원 가입
          </span>
        </Link>
      </div>

      <div className="flex justify-center">
        <Link href={`/login${query}`} className="text-sm font-semibold text-muted hover:text-primary">
          이미 계정이 있다면 로그인
        </Link>
      </div>
    </div>
  );
}
