import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AnnouncementsContent from "@/components/admin/announcements/AnnouncementsContent";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { MOCK_ANNOUNCEMENTS } from "@/lib/staff/announcements-data";

export const metadata: Metadata = {
  title: "Announcements — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default function AdminAnnouncementsPage() {
  return (
    <AdminLayout active="announcements" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <Suspense fallback={null}>
        <AnnouncementsContent base={MOCK_ANNOUNCEMENTS} />
      </Suspense>
    </AdminLayout>
  );
}
