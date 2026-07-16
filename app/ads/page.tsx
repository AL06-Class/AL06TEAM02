import type { Metadata } from "next";
import { AdsClient } from "./AdsClient";

export const metadata: Metadata = {
  title: "광고배너 안내",
  description: "CLIPBee 프리미엄 배너 상품과 광고 신청 안내",
};

export default function AdsPage() {
  return <AdsClient />;
}
