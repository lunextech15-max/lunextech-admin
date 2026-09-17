import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AnnouncementsContent from "@/components/admin/announcements/AnnouncementsContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllAnnouncements } from "@/lib/admin/announcements";

export const metadata: Metadata = {
  title: "Announcements — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminAnnouncementsPage() {
  const [identity, announcements] = await Promise.all([getAdminIdentity(), getAllAnnouncements()]);

  return (
    <AdminLayout active="announcements" adminName={identity.name} adminInitials={identity.initials}>
      <Suspense fallback={null}>
        <AnnouncementsContent announcements={announcements} authorStaffId={identity.lunexId} />
      </Suspense>
    </AdminLayout>
  );
}
