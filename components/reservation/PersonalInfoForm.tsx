"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  partySize: number | "";
  note: string;
};

export type Errors = Partial<Record<keyof PersonalInfo, string>>;

const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "icloud.com", "yahoo.com"];

function isValidStrictEmail(value: string) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value.trim());
}

function splitEmail(value: string) {
  const v = value.trim();
  const at = v.indexOf("@");
  if (at === -1) return { local: v, domain: "", hasAt: false };
  return { local: v.slice(0, at), domain: v.slice(at + 1), hasAt: true };
}

function applyDomain(local: string, domain: string) {
  if (!local) return "";
  return `${local}@${domain}`;
}

export default function PersonalInfoForm({
  form,
  setForm,
  errors,
  setErrors,
}: {
  form: PersonalInfo;
  setForm: React.Dispatch<React.SetStateAction<PersonalInfo>>;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}) {
  const inputBase =
    "mt-1 w-full h-10 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2";
  const inputOk = "border-black/10 focus:ring-tenton-brown/30";
  const inputErr = "border-tenton-red focus:ring-tenton-red/25";

  const setField = <K extends keyof PersonalInfo>(
    key: K,
    value: PersonalInfo[K]
  ) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) {
      setErrors((p) => ({ ...p, [key]: undefined }));
    }
  };

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length < 4) return digits;
    if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handlePhoneChange(value: string) {
    const formatted = formatPhone(value);
    const digits = formatted.replace(/\D/g, "");

    setForm((p) => ({ ...p, phone: formatted }));

    setErrors((p) => ({
      ...p,
      phone:
        digits.length === 0
          ? undefined
          : digits.length < 10
          ? "Enter a 10-digit phone number"
          : undefined,
    }));
  }

  function handleEmailChange(value: string) {
    setForm((p) => ({ ...p, email: value }));

    if (value.trim().length === 0) {
      setErrors((p) => ({ ...p, email: undefined }));
      return;
    }

    setErrors((p) => ({
      ...p,
      email: isValidStrictEmail(value) ? undefined : "Enter a valid email",
    }));
  }

  const [emailOpen, setEmailOpen] = useState(false);
  const [emailActive, setEmailActive] = useState(0);

  const { local, domain, hasAt } = splitEmail(form.email);

  const emailSuggestions = useMemo(() => {
    if (!hasAt) return [];
    const q = domain.toLowerCase();
    return EMAIL_DOMAINS.filter((d) => d.startsWith(q)).slice(0, 6);
  }, [hasAt, domain]);

  const pickSuggestion = (d: string) => {
    const nextEmail = applyDomain(local, d);
    setForm((p) => ({ ...p, email: nextEmail }));
    setErrors((p) => ({
      ...p,
      email: isValidStrictEmail(nextEmail) ? undefined : "Enter a valid email",
    }));
    setEmailOpen(false);
    setEmailActive(0);
  };

  const emailInvalid =
    form.email.trim().length > 0 && !isValidStrictEmail(form.email);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="mb-4 text-sm font-semibold text-black/70">
        Personal Information
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[12px] font-medium text-black/60">
            First name <span className="text-tenton-red">*</span>
          </label>
          <input
            required
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            className={[inputBase, errors.firstName ? inputErr : inputOk].join(
              " "
            )}
          />
          {errors.firstName ? (
            <div className="mt-1 text-[11px] text-tenton-red">
              {errors.firstName}
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-[12px] font-medium text-black/60">
            Last name <span className="text-tenton-red">*</span>
          </label>
          <input
            required
            value={form.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            className={[inputBase, errors.lastName ? inputErr : inputOk].join(
              " "
            )}
          />
          {errors.lastName ? (
            <div className="mt-1 text-[11px] text-tenton-red">
              {errors.lastName}
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-[12px] font-medium text-black/60">
            Phone number <span className="text-tenton-red">*</span>
          </label>
          <input
            required
            value={form.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={[inputBase, errors.phone ? inputErr : inputOk].join(" ")}
            placeholder="604-123-4567"
            inputMode="tel"
          />
          {errors.phone ? (
            <div className="mt-1 text-[11px] text-tenton-red">
              {errors.phone}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <label className="text-[12px] font-medium text-black/60">
            Email <span className="text-tenton-red">*</span>
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => {
              const v = e.target.value;
              handleEmailChange(v);

              const s = splitEmail(v);
              setEmailOpen(s.hasAt);
              setEmailActive(0);
            }}
            onFocus={() => {
              if (splitEmail(form.email).hasAt) setEmailOpen(true);
            }}
            onBlur={() => {
              setTimeout(() => setEmailOpen(false), 120);
            }}
            onKeyDown={(e) => {
              if (!emailOpen || emailSuggestions.length === 0) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setEmailActive((i) =>
                  Math.min(i + 1, emailSuggestions.length - 1)
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setEmailActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                pickSuggestion(emailSuggestions[emailActive]);
              } else if (e.key === "Escape") {
                setEmailOpen(false);
              }
            }}
            className={[
              inputBase,
              errors.email || emailInvalid ? inputErr : inputOk,
            ].join(" ")}
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="name@example.com"
          />

          {emailOpen && hasAt && emailSuggestions.length > 0 ? (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
              {emailSuggestions.map((d, idx) => (
                <button
                  key={d}
                  type="button"
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    pickSuggestion(d);
                  }}
                  className={[
                    "w-full px-3 py-2 text-left text-[13px]",
                    idx === emailActive ? "bg-black/[0.05]" : "bg-white",
                  ].join(" ")}
                >
                  <span className="text-black/60">{local}@</span>
                  <span className="text-black">{d}</span>
                </button>
              ))}
            </div>
          ) : null}

          {errors.email ? (
            <div className="mt-1 text-[11px] text-tenton-red">
              {errors.email}
            </div>
          ) : emailInvalid ? (
            <div className="mt-1 text-[11px] text-tenton-red">
              Enter a valid email
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-[12px] font-medium text-black/60">
            Number of guests <span className="text-tenton-red">*</span>
          </label>

          <div className="relative">
            <select
              required
              value={form.partySize === "" ? "" : String(form.partySize)}
              onChange={(e) => {
                const raw = e.target.value;
                setField("partySize", raw === "" ? "" : Number(raw));
              }}
              className={[
                inputBase,
                "appearance-none pr-10",
                errors.partySize ? inputErr : inputOk,
              ].join(" ")}
            >
              <option value="">Select</option>
              {Array.from({ length: 11 }).map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown size={18} />
            </div>
          </div>

          {errors.partySize && (
            <div className="mt-1 text-[11px] text-tenton-red">
              {errors.partySize}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-[12px] font-medium text-black/60">
          Special instruction (Optional)
        </label>
        <textarea
          value={form.note}
          onChange={(e) => setField("note", e.target.value)}
          className="mt-1 min-h-[110px] w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tenton-brown/30"
          placeholder="Any allergies, notes..."
        />
      </div>
    </div>
  );
}
