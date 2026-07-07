import { LoginBox } from "@/components/layout";

interface LoginPageProps {
  searchParams?: { redirect?: string | string[] };
}

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function LoginPage({ searchParams = {} }: LoginPageProps) {
  return (
    <div className="mx-auto flex min-h-[560px] w-full max-w-[400px] flex-col justify-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-ink">로그인</h1>
        <p className="mt-2 text-sm text-muted">촬영몬 데모 계정으로 역할을 선택해 시작합니다.</p>
      </div>
      <LoginBox companyRole="company-verified" redirectTo={firstParam(searchParams.redirect)} />
    </div>
  );
}
