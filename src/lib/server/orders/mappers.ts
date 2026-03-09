import type { OrderDTO } from "@/types/order";
import {
  currencyToString,
  orderStatusToString,
  paymentStatusToString,
  payMethodToString,
} from "./enums";
import type { OrderLineItemRow, OrderLineOptionRow, OrderRow } from "./types";

export function toOrderDTO(
  order: OrderRow,
  lineItems: OrderLineItemRow[],
  lineOptions: OrderLineOptionRow[]
): OrderDTO {
  return {
    id: order.id,
    status: orderStatusToString(order.status) as OrderDTO["status"],
    currency: currencyToString(order.currency) as OrderDTO["currency"],
    paymentStatus: paymentStatusToString(
      order.paymentStatus
    ) as OrderDTO["paymentStatus"],
    payMethod: payMethodToString(order.payMethod) as OrderDTO["payMethod"],
    subtotalCents: order.subtotalCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    pickupAt: order.pickupAt.toISOString(),
    customer: {
      firstName: order.customerFirstName,
      lastName: order.customerLastName,
      phone: order.customerPhone,
      email: order.customerEmail,
      note: order.customerNote,
    },
    lineItems: lineItems.map((li) => ({
      id: li.id,
      orderId: li.orderId,
      menuItemId: li.menuItemId,
      itemNameSnapshot: li.itemNameSnapshot,
      itemImageUrlSnapshot: li.itemImageUrlSnapshot,
      unitBasePriceCentsSnapshot: li.unitBasePriceCentsSnapshot,
      currency: currencyToString(li.currency) as OrderDTO["currency"],
      qty: li.qty,
      note: li.note,
      lineSubtotalCentsSnapshot: li.lineSubtotalCentsSnapshot,
      createdAt: li.createdAt.toISOString(),
      updatedAt: li.updatedAt.toISOString(),
      options: lineOptions
        .filter((op) => op.orderLineItemId === li.id)
        .map((op) => ({
          id: op.id,
          orderLineItemId: op.orderLineItemId,
          groupId: op.groupId,
          groupTitleSnapshot: op.groupTitleSnapshot,
          optionId: op.optionId,
          optionNameSnapshot: op.optionNameSnapshot,
          unitPriceDeltaCentsSnapshot: op.unitPriceDeltaCentsSnapshot,
          qty: op.qty,
          createdAt: op.createdAt.toISOString(),
          updatedAt: op.updatedAt.toISOString(),
        })),
    })),
  };
}
