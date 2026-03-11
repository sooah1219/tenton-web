import { Check } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

type ReservationDto = {
  id: string;
  dateIso: string;
  time: string;
  partySize: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatReservation(dateIso: string, time: string) {
  const [y, m, d] = dateIso.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  const dateLabel = date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return `${dateLabel} • ${time}`;
}

async function getOrigin() {
  const h = await headers();
  const host = h.get("host");

  if (!host) return "http://localhost:3000";

  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${proto}://${host}`;
}

async function getReservation(id: string): Promise<ReservationDto> {
  const origin = await getOrigin();

  const res = await fetch(`${origin}/api/reservations/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load reservation");
  }

  return res.json();
}

export default async function ReservationConfirmedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await getReservation(id);

  const storeAddress = "1731 Marine Drive, West Vancouver, Canada V7V1J5";
  const phone = "(604) 912-0288";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    storeAddress
  )}`;
  const googleMapsUrl =
    "https://www.google.com/maps?q=1731+Marine+Drive,+West+Vancouver,+BC&output=embed";

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="border-b border-black/10 px-6 py-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tenton-red sm:h-6 sm:w-6">
                  <Check
                    size={12}
                    className="stroke-[3] text-white sm:size-[14px]"
                  />
                </span>
                <span className="text-base font-semibold leading-tight sm:text-3xl md:text-[26px] text-tenton-red">
                  Your Reservation is Confirmed
                </span>
              </div>

              <div className="mt-2 text-sm text-black/50">
                We’ve received your reservation request.
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6">
              <div>
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div className="flex justify-between sm:block">
                    <div className="text-black/50">Name</div>
                    <div className="font-medium text-black/80">
                      {r.firstName} {r.lastName}
                    </div>
                  </div>

                  <div className="flex justify-between sm:block">
                    <div className="text-black/50">Time</div>
                    <div className="font-medium text-black/80">
                      {formatReservation(r.dateIso, r.time)}
                    </div>
                  </div>

                  <div className="flex justify-between sm:block">
                    <div className="text-black/50">Guests</div>
                    <div className="font-medium text-black/80">
                      {r.partySize} {r.partySize === 1 ? "person" : "people"}
                    </div>
                  </div>

                  <div className="flex justify-between sm:block">
                    <div className="text-black/50">Phone</div>
                    <div className="font-medium text-black/80">{r.phone}</div>
                  </div>

                  <div className="flex justify-between sm:block sm:col-span-2">
                    <div className="text-black/50">Email</div>
                    <div className="font-medium text-black/80">{r.email}</div>
                  </div>
                </div>
              </div>

              {r.note ? (
                <div>
                  <div className="mb-2 text-sm font-semibold text-black/70">
                    Special Instruction
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-black/60">
                    {r.note}
                  </div>
                </div>
              ) : null}

              <div>
                <div className="mb-2 text-sm font-semibold text-black/70">
                  Store Address
                </div>
                <div className="text-sm text-black/60">{storeAddress}</div>

                <div className="mt-3 overflow-hidden rounded-xl border border-black/10">
                  <iframe
                    title="map"
                    src={googleMapsUrl}
                    className="h-52 w-full"
                    loading="lazy"
                  />
                </div>

                <div className="mt-2 text-sm">
                  <a
                    href={mapsHref}
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

          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}
