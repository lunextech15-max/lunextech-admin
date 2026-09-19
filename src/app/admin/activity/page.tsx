import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ActivityContent from "@/components/admin/activity/ActivityContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllActivity } from "@/lib/admin/activity";

export const metadata: Metadata = {
  title: "Activity — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminActivityPage() {
  const [identity, activity] = await Promise.all([getAdminIdentity(), getAllActivity()]);

  return (
    <AdminLayout active="activity" adminName={identity.name} adminInitials={identity.initials} staffId={identity.staffId}>
      <ActivityContent activity={activity} />
    </AdminLayout>
  );
}
