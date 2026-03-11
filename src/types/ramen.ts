import type { Activatable, Currency, ID, Sortable, Timestamped } from "./menu";

export type OptionGroupKind = "protein" | "noodle" | "topping" | "custom";
export type OptionSelection = "single" | "multi";

export type OptionGroup = Timestamped &
  Sortable &
  Activatable & {
    id: ID;
    kind: OptionGroupKind;
    title: string;
    step: number;
    selection: OptionSelection;
    required: boolean;
    minSelected: number;
    maxSelected: number;
  };

export type Option = Timestamped &
  Sortable &
  Activatable & {
    id: ID;
    groupId: ID;
    name: string;
    description?: string | null;
    priceDeltaCents: number;
    currency: Currency;
    imageUrl?: string | null;
    maxQty?: number | null;
    defaultQty?: number | null;
  };

export type MenuItemOptionGroup = Timestamped &
  Sortable & {
    id: ID;
    menuItemId: ID;
    groupId: ID;
    requiredOverride?: boolean | null;
    minSelectedOverride?: number | null;
    maxSelectedOverride?: number | null;
  };

export type MenuItemAllowedOption = Timestamped & {
  id: ID;
  menuItemId: ID;
  optionId: ID;
};

export type RamenSelection = {
  proteinOptionId: ID;
  noodleOptionId: ID;
  toppings: { optionId: ID; qty: number }[];
  note?: string;
  selectedOptionNames?: Record<string, string>;
  selectedOptionPriceMap?: Record<string, number>;
};

export type MenuOptionGroupDTO = {
  id: ID;
  title: string;
  required: boolean;
  minSelected: number;
  maxSelected: number;
  sortOrder: number;
  options: {
    id: ID;
    groupId: ID;
    name: string;
    description?: string | null;
    priceDeltaCents: number;
    imageUrl?: string | null;
    maxQty: number;
    defaultQty: number;
    sortOrder: number;
  }[];
};

export type RamenConfigDTO = {
  menuItemId: ID;
  optionGroups: MenuOptionGroupDTO[];
};
