"use client";

import Button from "@/components/ui/CtaButton";
import { useState, type FormEvent } from "react";

type PayMethod = "store" | "card";

type Errors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  cardNumber?: string;
  cardExp?: string;
  cardCvc?: string;
};

const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "icloud.com", "yahoo.com"];

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function cardDigits(raw: string) {
  return raw.replace(/\D/g, "");
}

function formatExp(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhnCheck(num: string) {
  let sum = 0;
  let doubleIt = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (doubleIt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    doubleIt = !doubleIt;
  }

  return sum % 10 === 0;
}

function isValidEmail(value: string) {
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

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length < 4) return digits;
  if (digits.length < 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validateFirstName(value: string) {
  if (!value.trim()) return "First name is required.";
  return undefined;
}

function validateLastName(value: string) {
  if (!value.trim()) return "Last name is required.";
  return undefined;
}

function validatePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!value.trim()) return "Phone number is required.";
  if (digits.length !== 10)
    return "Please enter a valid 10-digit phone number.";
  return undefined;
}

function validateEmail(value: string) {
  if (!value.trim()) return "Email is required.";
  if (!isValidEmail(value)) return "Please enter a valid email address.";
  return undefined;
}

function validateCardNumber(value: string) {
  const digits = cardDigits(value);

  if (!digits) return "Card number is required.";
  if (digits.length < 13 || digits.length > 19) {
    return "Card number must be 13–19 digits.";
  }
  if (!luhnCheck(digits)) return "Card number is invalid.";

  return undefined;
}

function validateCardExp(value: string) {
  const exp = value.trim();

  if (!exp) return "Expiry date is required.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return "Expiry must be MM/YY.";

  const [mmStr, yyStr] = exp.split("/");
  const mm = Number(mmStr);
  const yy = Number(yyStr);

  const now = new Date();
  const currentYY = now.getFullYear() % 100;
  const currentMM = now.getMonth() + 1;

  if (yy < currentYY || (yy === currentYY && mm < currentMM)) {
    return "Card is expired.";
  }

  return undefined;
}

function validateCardCvc(value: string) {
  const cvc = value.replace(/\D/g, "");
  if (!cvc) return "CVC is required.";
  if (cvc.length < 3 || cvc.length > 4) return "CVC must be 3–4 digits.";
  return undefined;
}

export default function PaymentForm({
  firstName,
  lastName,
  phone,
  email,
  note,
  payMethod,
  setFirstName,
  setLastName,
  setPhone,
  setEmail,
  setNote,
  setPayMethod,
  onPlaceOrder,
  disabled,
}: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  note: string;
  payMethod: PayMethod;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setNote: (v: string) => void;
  setPayMethod: (v: PayMethod) => void;
  onPlaceOrder: () => void;
  disabled: boolean;
}) {
  const [errors, setErrors] = useState<Errors>({});

  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [emailOpen, setEmailOpen] = useState(false);
  const [emailActive, setEmailActive] = useState(0);

  const { local, domain, hasAt } = splitEmail(email);

  const emailSuggestions = hasAt
    ? EMAIL_DOMAINS.filter((d) => d.startsWith(domain.toLowerCase())).slice(
        0,
        6
      )
    : [];

  const pickEmailSuggestion = (d: string) => {
    const nextEmail = applyDomain(local, d);
    setEmail(nextEmail);
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(nextEmail),
    }));
    setEmailOpen(false);
    setEmailActive(0);
  };

  function validateAll(): Errors {
    return {
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      phone: validatePhone(phone),
      email: validateEmail(email),
      cardNumber:
        payMethod === "card" ? validateCardNumber(cardNumber) : undefined,
      cardExp: payMethod === "card" ? validateCardExp(cardExp) : undefined,
      cardCvc: payMethod === "card" ? validateCardCvc(cardCvc) : undefined,
    };
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors = validateAll();
    setErrors(nextErrors);

    if (disabled) return;
    if (Object.values(nextErrors).some(Boolean)) return;

    onPlaceOrder();
  }

  const inputBase =
    "w-full rounded-xl border px-3 py-2 outline-none focus:border-tenton-brown placeholder:text-xs";
  const okBorder = "border-black/10";
  const errBorder = "border-tenton-red";

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="font-semibold text-black/70">Personal Information</div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60">
              First name <span className="text-tenton-red">*</span>
            </span>
            <input
              value={firstName}
              onChange={(e) => {
                const v = e.target.value;
                setFirstName(v);
                setErrors((prev) => ({
                  ...prev,
                  firstName: validateFirstName(v),
                }));
              }}
              className={[
                inputBase,
                errors.firstName ? errBorder : okBorder,
              ].join(" ")}
            />
            {errors.firstName && (
              <span className="text-[11px] text-tenton-red">
                {errors.firstName}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60">
              Last name <span className="text-tenton-red">*</span>
            </span>
            <input
              value={lastName}
              onChange={(e) => {
                const v = e.target.value;
                setLastName(v);
                setErrors((prev) => ({
                  ...prev,
                  lastName: validateLastName(v),
                }));
              }}
              className={[
                inputBase,
                errors.lastName ? errBorder : okBorder,
              ].join(" ")}
            />
            {errors.lastName && (
              <span className="text-[11px] text-tenton-red">
                {errors.lastName}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60">
              Phone number <span className="text-tenton-red">*</span>
            </span>
            <input
              value={phone}
              onChange={(e) => {
                const v = formatPhone(e.target.value);
                setPhone(v);
                setErrors((prev) => ({
                  ...prev,
                  phone: validatePhone(v),
                }));
              }}
              placeholder="604-123-4567"
              inputMode="tel"
              className={[inputBase, errors.phone ? errBorder : okBorder].join(
                " "
              )}
            />
            {errors.phone && (
              <span className="text-[11px] text-tenton-red">
                {errors.phone}
              </span>
            )}
          </label>

          <label className="relative flex flex-col gap-1 text-sm">
            <span className="text-black/60">
              Email <span className="text-tenton-red">*</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                const v = e.target.value;
                setEmail(v);
                setErrors((prev) => ({
                  ...prev,
                  email: validateEmail(v),
                }));

                const s = splitEmail(v);
                setEmailOpen(s.hasAt);
                setEmailActive(0);
              }}
              onFocus={() => {
                if (splitEmail(email).hasAt) setEmailOpen(true);
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
                  pickEmailSuggestion(emailSuggestions[emailActive]);
                } else if (e.key === "Escape") {
                  setEmailOpen(false);
                }
              }}
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="name@example.com"
              className={[inputBase, errors.email ? errBorder : okBorder].join(
                " "
              )}
            />

            {emailOpen && hasAt && emailSuggestions.length > 0 ? (
              <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
                {emailSuggestions.map((d, idx) => (
                  <button
                    key={d}
                    type="button"
                    onMouseDown={(ev) => {
                      ev.preventDefault();
                      pickEmailSuggestion(d);
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

            {errors.email && (
              <span className="text-[11px] text-tenton-red">
                {errors.email}
              </span>
            )}
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="font-semibold text-black/70">Other Information</div>
        <span className="text-sm text-black/60">
          Special instruction (Optional)
        </span>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any allergies, note .."
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-[#fbfaf8] px-3 py-2 outline-none focus:border-tenton-brown placeholder:text-xs"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="font-semibold text-black/70">
          Choose a payment method
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={payMethod === "store"}
              onChange={() => {
                setPayMethod("store");
                setErrors((prev) => ({
                  ...prev,
                  cardNumber: undefined,
                  cardExp: undefined,
                  cardCvc: undefined,
                }));
              }}
            />
            <span>Pay at Store</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={payMethod === "card"}
              onChange={() => {
                setPayMethod("card");
                setErrors((prev) => ({
                  ...prev,
                  cardNumber: validateCardNumber(cardNumber),
                  cardExp: validateCardExp(cardExp),
                  cardCvc: validateCardCvc(cardCvc),
                }));
              }}
            />
            <span>Credit Card</span>
          </label>
        </div>

        {payMethod === "card" && (
          <div className="flex flex-col gap-3 rounded-xl border border-black/10 bg-[#fbfaf8] p-4">
            <div className="text-sm font-semibold text-black/70">
              Payment information
            </div>

            <label className="flex flex-col gap-1">
              <input
                placeholder="Card number"
                value={cardNumber}
                onChange={(e) => {
                  const v = formatCardNumber(e.target.value);
                  setCardNumber(v);
                  setErrors((prev) => ({
                    ...prev,
                    cardNumber: validateCardNumber(v),
                  }));
                }}
                inputMode="numeric"
                autoComplete="cc-number"
                className={[
                  inputBase,
                  errors.cardNumber ? errBorder : okBorder,
                ].join(" ")}
              />
              {errors.cardNumber && (
                <span className="text-[11px] text-tenton-red">
                  {errors.cardNumber}
                </span>
              )}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <input
                  placeholder="MM/YY"
                  value={cardExp}
                  onChange={(e) => {
                    const v = formatExp(e.target.value);
                    setCardExp(v);
                    setErrors((prev) => ({
                      ...prev,
                      cardExp: validateCardExp(v),
                    }));
                  }}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  className={[
                    inputBase,
                    errors.cardExp ? errBorder : okBorder,
                  ].join(" ")}
                />
                {errors.cardExp && (
                  <span className="text-[11px] text-tenton-red">
                    {errors.cardExp}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1">
                <input
                  placeholder="CVC"
                  value={cardCvc}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setCardCvc(v);
                    setErrors((prev) => ({
                      ...prev,
                      cardCvc: validateCardCvc(v),
                    }));
                  }}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  className={[
                    inputBase,
                    errors.cardCvc ? errBorder : okBorder,
                  ].join(" ")}
                />
                {errors.cardCvc && (
                  <span className="text-[11px] text-tenton-red">
                    {errors.cardCvc}
                  </span>
                )}
              </label>
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={disabled}
        size="md"
        variant={disabled ? "ghost" : "primary"}
        className="w-full"
      >
        Place Order
      </Button>
    </form>
  );
}
