"use client";

import { cldImage } from "@/lib/cloudinary";
import type { OrderDTO } from "@/types/order";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

function moneyFromCents(cents: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format((cents ?? 0) / 100);
}

function formatPickupTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConfirmedPageClient({ order }: { order: OrderDTO }) {
  const storeAddress = "1731 Marine Drive, West Vancouver, Canada V7V1J6";
  const phone = "6041234567";

  const googleMapsUrl = useMemo(() => {
    const q = encodeURIComponent(storeAddress);
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }, [storeAddress]);

  const customerName = useMemo(() => {
    const first = order.customer?.firstName ?? "";
    const last = order.customer?.lastName ?? "";
    const full = `${first} ${last}`.trim();
    return full || "-";
  }, [order]);

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="px-3 py-5 sm:px-4 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="border-b border-black/10 px-4 pb-4 pt-5 text-center sm:px-6 sm:pt-6">
              <div className="inline-flex items-center justify-center gap-2 text-tenton-red">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tenton-red sm:h-6 sm:w-6">
                  <Check
                    size={12}
                    className="stroke-[3] text-white sm:size-[14px]"
                  />
                </span>
                <span className="text-base font-semibold leading-tight sm:text-2xl md:text-[26px]">
                  Your Order is Confirmed
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="flex items-start justify-between gap-4 sm:block">
                  <div className="shrink-0 text-black/50">Customer</div>
                  <div className="text-right font-medium text-black/80 sm:mt-1 sm:text-left break-words">
                    {customerName}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 sm:block">
                  <div className="shrink-0 text-black/50">Order Number</div>
                  <div className="text-right font-medium text-black/80 sm:mt-1 sm:text-left">
                    #{order.id.slice(0, 8)}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 sm:block">
                  <div className="shrink-0 text-black/50">Pick up Time</div>
                  <div className="text-right font-medium text-black/80 sm:mt-1 sm:text-left">
                    {formatPickupTime(order.pickupAt)}
                  </div>
                </div>

                {/* <div className="flex items-start justify-between gap-4 sm:block">
                  <div className="shrink-0 text-black/50">Subtotal</div>
                  <div className="text-right font-medium text-black/80 sm:mt-1 sm:text-left tabular-nums">
                    {moneyFromCents(order.subtotalCents)}
                  </div>
                </div> */}
              </div>

              <div>
                <div className="mb-3 text-sm font-semibold text-black/70">
                  Order Summary
                </div>

                <div className="flex flex-col gap-4">
                  {order.lineItems.map((li) => (
                    <div key={li.id} className="flex items-start gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/5 sm:h-16 sm:w-16">
                          {li.itemImageUrlSnapshot ? (
                            <Image
                              src={cldImage(li.itemImageUrlSnapshot)}
                              alt={li.itemNameSnapshot}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-[11px] text-black/40">
                              —
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium leading-5 text-black/80 break-words">
                            {li.qty} × {li.itemNameSnapshot}
                          </div>

                          {li.note ? (
                            <div className="mt-1 text-[12px] leading-5 text-black/50 break-words">
                              Note: {li.note}
                            </div>
                          ) : null}

                          {li.options?.length ? (
                            <div className="mt-1 text-[12px] leading-5 text-black/45 break-words">
                              {li.options
                                .map((op) => {
                                  const qty =
                                    op.qty && op.qty !== 1 ? ` ×${op.qty}` : "";
                                  return `${op.optionNameSnapshot}${qty}`;
                                })
                                .join(", ")}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="w-[88px] shrink-0 pt-[1px] text-right text-sm font-semibold text-black/70 tabular-nums sm:w-[96px]">
                        {moneyFromCents(li.lineSubtotalCentsSnapshot)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-black/10 pt-4 text-sm">
                  <div className="flex items-center justify-between text-black/60">
                    <span>Subtotal</span>
                    <span className="font-medium text-black/80 tabular-nums">
                      {moneyFromCents(order.subtotalCents)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-black/60">
                    <span>Tax</span>
                    <span className="font-medium text-black/80 tabular-nums">
                      {moneyFromCents(order.taxCents)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-black/80">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold tabular-nums">
                      {moneyFromCents(order.totalCents)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-black/70">
                  Store Address
                </div>

                <div className="text-sm leading-6 text-black/60 break-words">
                  {storeAddress}
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-black/10">
                  <iframe
                    title="map"
                    src={googleMapsUrl}
                    className="h-48 w-full sm:h-52"
                    loading="lazy"
                  />
                </div>

                <div className="mt-2 text-sm">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      storeAddress
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-tenton-brown hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <a
                  href={`tel:${phone}`}
                  className="grid h-10 place-items-center rounded-full border border-tenton-red bg-tenton-red px-6 text-sm font-semibold text-white transition hover:bg-white hover:text-tenton-red"
                >
                  Call Restaurant
                </a>

                <Link
                  href="/"
                  className="grid h-10 place-items-center rounded-full border border-tenton-brown px-6 text-sm font-semibold text-tenton-brown transition hover:bg-tenton-brown hover:text-white"
                >
                  Go back home
                </Link>
              </div>
            </div>
          </div>

          <div className="h-8 sm:h-10" />
        </div>
      </div>
    </div>
  );
}
