"use client";

import DateSelectRow from "@/components/reservation/DateSelectRow";
import Hero from "@/components/reservation/Hero";
import PersonalInfoForm, {
  type Errors,
  type PersonalInfo,
} from "@/components/reservation/PersonalInfoForm";
import TimeSlots from "@/components/reservation/TimeSlots";
import Button from "@/components/ui/CtaButton";
import { createReservation } from "@/lib/api/reservation";
import {
  CLOSE,
  buildAllDaySlots,
  buildDateOptions,
  buildTimeSlotsFromNowPlus30,
  formatISO,
  getNowVancouverMinutes,
  isValidEmail,
} from "@/utils/reservationTime";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ReservationClient() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  const [dateOptions, setDateOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [form, setForm] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    partySize: "",
    note: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const options = buildDateOptions(21);
    setDateOptions(options);
    setDate(options[0]?.value ?? formatISO(new Date()));
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || dateOptions.length === 0) return;

    const now = getNowVancouverMinutes();
    if (now > CLOSE) {
      const tomorrow = dateOptions[1]?.value;
      if (tomorrow) setDate(tomorrow);
    }
  }, [mounted, dateOptions]);

  const timeOptions = useMemo(() => {
    if (!mounted || dateOptions.length === 0 || !date) return [];

    const todayValue = dateOptions[0]?.value;
    const isToday = date === todayValue;

    if (isToday) return buildTimeSlotsFromNowPlus30();
    return buildAllDaySlots();
  }, [mounted, date, tick, dateOptions]);

  useEffect(() => {
    if (!mounted) return;

    const first = timeOptions[0] ?? "";
    if (!time || !timeOptions.includes(time)) {
      setTime(first);
    }
  }, [mounted, timeOptions, time]);

  function validate(): Errors {
    const next: Errors = {};

    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) {
      next.phone = "Phone number is required";
    } else if (phoneDigits.length !== 10) {
      next.phone = "Enter a 10-digit phone number";
    }

    if (!form.email.trim()) next.email = "Email is required";
    else if (!isValidEmail(form.email)) next.email = "Enter a valid email";

    if (form.partySize === "") next.partySize = "Required";
    else if (
      !Number.isFinite(form.partySize) ||
      form.partySize < 1 ||
      form.partySize > 50
    ) {
      next.partySize = "Enter a number (1-50)";
    }

    return next;
  }

  async function onReserve() {
    const next = validate();
    setErrors(next);
    setServerError(null);

    if (Object.keys(next).length > 0) return;
    if (submitting) return;

    const partySize = form.partySize as number;

    try {
      setSubmitting(true);

      const saved = await createReservation({
        dateIso: date,
        time,
        partySize,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        note: form.note.trim() ? form.note.trim() : undefined,
      });

      router.push(`/reservation/confirmed/${saved.id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create reservation.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-tenton-bg pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 pb-[calc(env(safe-area-inset-bottom,0px)+24px)]">
          <Hero />
          <h1 className="text-center font-averia-serif text-4xl text-tenton-brown md:text-5xl">
            Reserve a Table
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tenton-bg pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 pb-[calc(env(safe-area-inset-bottom,0px)+24px)]">
        <Hero />

        <h1 className="text-center font-averia-serif text-4xl text-tenton-brown md:text-5xl">
          Reserve a Table
        </h1>

        <section className="mx-5">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 shadow-sm">
            <div className="space-y-4 p-5">
              <DateSelectRow
                date={date}
                setDate={setDate}
                dateOptions={dateOptions}
              />
              <TimeSlots
                time={time}
                setTime={setTime}
                timeOptions={timeOptions}
              />
            </div>

            <div className="border-t border-black/10" />

            <div className="grid grid-cols-1 items-start gap-6 p-5 lg:grid-cols-[1fr_360px]">
              <div className="space-y-3">
                <PersonalInfoForm
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  setErrors={setErrors}
                />

                {serverError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-50 p-3 text-sm text-red-700">
                    {serverError}
                  </div>
                )}
              </div>

              <Button onClick={onReserve} showArrow disabled={submitting}>
                {submitting ? "Reserving..." : "Reserve"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
