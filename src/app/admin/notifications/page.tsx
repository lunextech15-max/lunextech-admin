import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import NotificationsPageContent from "@/components/shared/notifications/NotificationsPageContent";
import { getAdminIdentity } from "@/lib/admin/identity";

export const metadata: Metadata = {
  title: "Notifications — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminNotificationsPage() {
  const identity = await getAdminIdentity();

  return (
    <AdminLayout active="notifications" adminName={identity.name} adminInitials={identity.initials} staffId={identity.staffId}>
      <NotificationsPageContent breadcrumbNumber="10" />
    </AdminLayout>
  );
}
