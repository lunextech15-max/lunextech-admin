import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ApplicationsContent from "@/components/admin/applications/ApplicationsContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { MOCK_APPLICATIONS } from "@/lib/admin/applications-data";

export const metadata: Metadata = {
  title: "Applications — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminApplicationsPage() {
  const identity = await getAdminIdentity();

  return (
    <AdminLayout active="applications" adminName={identity.name} adminInitials={identity.initials}>
      <ApplicationsContent applications={MOCK_APPLICATIONS} />
    </AdminLayout>
  );
}
