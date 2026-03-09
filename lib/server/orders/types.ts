export type OrderRow = {
  id: string;
  status: number;
  currency: number;
  paymentStatus: number;
  payMethod: number;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  createdAt: Date;
  updatedAt: Date;
  pickupAt: Date;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  customerNote: string | null;
};

export type OrderLineItemRow = {
  id: string;
  orderId: string;
  menuItemId: string;
  itemNameSnapshot: string;
  itemImageUrlSnapshot: string | null;
  unitBasePriceCentsSnapshot: number;
  currency: number;
  qty: number;
  note: string | null;
  lineSubtotalCentsSnapshot: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderLineOptionRow = {
  id: string;
  orderLineItemId: string;
  groupId: string;
  groupTitleSnapshot: string;
  optionId: string;
  optionNameSnapshot: string;
  unitPriceDeltaCentsSnapshot: number;
  qty: number;
  createdAt: Date;
  updatedAt: Date;
};
