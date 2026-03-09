export const runtime = "nodejs";

import { createOrder } from "@/lib/server/orders/create-order";
import { getOrdersWithDetails } from "@/lib/server/orders/queries";
import { CreateOrderSchema } from "@/lib/server/orders/validators";
import { badRequest, ok, serverError } from "@/lib/server/response";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitRaw = searchParams.get("limit");
    const limit = limitRaw ? Number(limitRaw) : 50;

    const items = await getOrdersWithDetails(limit);
    return ok(items);
  } catch (error) {
    console.error("GET /api/orders failed");
    console.error(error);
    return serverError(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST /api/orders body:", JSON.stringify(body, null, 2));

    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      console.error("CreateOrderSchema error:", flattened);

      return Response.json(
        {
          message: "Invalid order payload.",
          errors: flattened,
        },
        { status: 400 }
      );
    }

    const result = await createOrder(parsed.data);
    return ok(result);
  } catch (error) {
    console.error("POST /api/orders failed");
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (
      message === "No items." ||
      message === "menuItemId is required." ||
      message.startsWith("Invalid ")
    ) {
      return badRequest(message);
    }

    return serverError(message);
  }
}
