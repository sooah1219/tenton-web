import { getOrderByIdWithDetails } from "@/lib/server/orders/queries";
import { notFound } from "next/navigation";
import ConfirmedPageClient from "./ConfirmedPageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await getOrderByIdWithDetails(orderId);

  if (!order) {
    notFound();
  }

  return <ConfirmedPageClient order={order} />;
}
