export const MenuItemKind = {
  ramen: 1,
  food: 2,
  drink: 3,
} as const;

export const Currency = {
  CAD: 0,
} as const;

export const OptionGroupKind = {
  protein: 1,
  noodle: 2,
  topping: 3,
} as const;

export const OptionSelection = {
  single: 1,
  multi: 2,
} as const;

export const OrderStatus = {
  CONFIRMED: 0,
  CANCELLED: 1,
} as const;

export const PaymentStatus = {
  UNPAID: 0,
  PAID: 1,
} as const;

export const PayMethod = {
  store: 0,
  card: 1,
} as const;
