export function orderStatusToString(value: number) {
  switch (value) {
    case 0:
      return "CONFIRMED";
    case 1:
      return "CANCELLED";
    default:
      return String(value);
  }
}

export function paymentStatusToString(value: number) {
  switch (value) {
    case 0:
      return "UNPAID";
    case 1:
      return "PAID";
    default:
      return String(value);
  }
}

export function payMethodToString(value: number) {
  switch (value) {
    case 0:
      return "store";
    case 1:
      return "card";
    default:
      return String(value);
  }
}

export function currencyToString(value: number) {
  switch (value) {
    case 0:
      return "CAD";
    default:
      return String(value);
  }
}

export function orderStatusFromString(value: string) {
  switch (value) {
    case "CONFIRMED":
      return 0;
    case "CANCELLED":
      return 1;
    default:
      return null;
  }
}
