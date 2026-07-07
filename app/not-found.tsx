import Link from "next/link";
import { CameraOff } from "lucide-react";
import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <EmptyState
      icon={<CameraOff aria-hidden className="h-6 w-6" />}
      title="페이지를 찾을 수 없습니다"
      action={
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          메인으로
        </Link>
      }
    />
  );
}
