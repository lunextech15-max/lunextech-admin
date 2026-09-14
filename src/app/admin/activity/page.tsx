import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ActivityContent from "@/components/admin/activity/ActivityContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { MOCK_ADMIN_ACTIVITY } from "@/lib/admin/activity-data";

export const metadata: Metadata = {
  title: "Activity — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminActivityPage() {
  const identity = await getAdminIdentity();

  return (
    <AdminLayout active="activity" adminName={identity.name} adminInitials={identity.initials}>
      <ActivityContent activity={MOCK_ADMIN_ACTIVITY} />
    </AdminLayout>
  );
}
