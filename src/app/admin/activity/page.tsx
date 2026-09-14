import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ActivityContent from "@/components/admin/activity/ActivityContent";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { MOCK_ADMIN_ACTIVITY } from "@/lib/admin/activity-data";

export const metadata: Metadata = {
  title: "Activity — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default function AdminActivityPage() {
  return (
    <AdminLayout active="activity" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <ActivityContent activity={MOCK_ADMIN_ACTIVITY} />
    </AdminLayout>
  );
}
