export function toMinutes(time12h: string) {
  const raw = time12h.trim().toUpperCase();
  const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

  if (!match) {
    throw new Error("Invalid time format");
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const ampm = match[3];

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    throw new Error("Invalid time value");
  }

  if (ampm === "AM") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }

  return hour * 60 + minute;
}

export function buildReservedAt(dateIso: string, time12h: string) {
  const parts = dateIso.trim().split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date");
  }

  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);

  const mins = toMinutes(time12h);
  const hh = Math.floor(mins / 60);
  const mm = mins % 60;

  return new Date(y, m - 1, d, hh, mm, 0, 0);
}
