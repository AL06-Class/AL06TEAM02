import type { Metadata } from "next";
import { SupportClient } from "./SupportClient";

export const metadata: Metadata = {
  title: "고객센터",
  description: "CLIPBee FAQ와 1:1 문의 접수 안내",
};

export default function SupportPage() {
  return <SupportClient />;
}
