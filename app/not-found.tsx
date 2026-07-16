import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center">
      <Link
        href="/"
        className="text-2xl font-black text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        CLIPBee
      </Link>
      <p className="mt-5 text-lg font-bold text-ink">페이지를 찾을 수 없습니다</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        메인으로
      </Link>
    </section>
  );
}
