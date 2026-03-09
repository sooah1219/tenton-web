import { getOrderWithDetails } from "@/lib/server/orders/queries";
import { notFound, ok, serverError } from "@/lib/server/response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await getOrderWithDetails(id);
    if (!order) return notFound();

    return ok(order);
  } catch {
    return serverError();
  }
}
