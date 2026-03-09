export function calcTaxCents(subtotalCents: number) {
  return Math.round(subtotalCents * 0.05);
}
