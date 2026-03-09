import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/server/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const BodySchema = z.object({
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const adminPw = process.env.ADMIN_PASSWORD ?? "";
    if (!adminPw || parsed.data.password !== adminPw) {
      return NextResponse.json(
        { error: "Invalid admin password" },
        { status: 401 }
      );
    }

    const token = signAdminToken();

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return res;
  } catch (err) {
    console.error("LOGIN ROUTE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
