import type { ItemConfig } from "./MenuItemModal";

export function moneyFromCents(cents: number) {
  const n = cents / 100;
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

export function moneyFromDollars(dollars: number) {
  return dollars.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

export function configKey(itemId: string, cfg: ItemConfig) {
  return `${itemId}|${JSON.stringify(cfg)}`;
}

export function lineExtraPriceCents(cfg: ItemConfig) {
  const selectedOptionPriceMap = cfg.selectedOptionPriceMap ?? {};
  const list = cfg.toppings ?? [];

  return list.reduce(
    (sum, t) => sum + (selectedOptionPriceMap[t.optionId] ?? 0) * (t.qty ?? 1),
    0
  );
}

export function lineSummary(cfg: ItemConfig) {
  const selectedOptionNames = cfg.selectedOptionNames ?? {};

  const protein = cfg.proteinOptionId
    ? selectedOptionNames[cfg.proteinOptionId] ?? ""
    : "";

  const noodle = cfg.noodleOptionId
    ? selectedOptionNames[cfg.noodleOptionId] ?? ""
    : "";

  const tops = (cfg.toppings ?? [])
    .map((t) => selectedOptionNames[t.optionId] ?? "")
    .filter(Boolean)
    .map((name) => `+${name}`);

  return [protein, noodle, ...tops].filter(Boolean).join(" , ");
}
