import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ApplicationsContent from "@/components/admin/applications/ApplicationsContent";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { MOCK_APPLICATIONS } from "@/lib/admin/applications-data";

export const metadata: Metadata = {
  title: "Applications — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default function AdminApplicationsPage() {
  return (
    <AdminLayout active="applications" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <ApplicationsContent applications={MOCK_APPLICATIONS} />
    </AdminLayout>
  );
}
