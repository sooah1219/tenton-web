import AdminOrdersDashboardPage from "@/components/admin/AdminOrdersDashboardPage";
import { getAdminSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin-login?next=/tentonAdmin/orders");
  }

  return <AdminOrdersDashboardPage />;
}
