import { notFound } from "next/navigation";
import { isServiceProductKey, serviceProductKeys } from "@/lib/service-products";
import { OrderFlow } from "./OrderFlow";

interface OrderPageProps {
  params: { productKey: string };
}

export function generateStaticParams() {
  return serviceProductKeys.map((productKey) => ({ productKey }));
}

export default function OrderPage({ params }: OrderPageProps) {
  if (!isServiceProductKey(params.productKey)) notFound();
  return <OrderFlow productKey={params.productKey} />;
}
