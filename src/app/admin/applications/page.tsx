import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ApplicationsContent from "@/components/admin/applications/ApplicationsContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllApplications } from "@/lib/admin/real-applications";

export const metadata: Metadata = {
  title: "Applications — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminApplicationsPage() {
  const identity = await getAdminIdentity();
  const { applications, error } = await getAllApplications();

  return (
    <AdminLayout active="applications" adminName={identity.name} adminInitials={identity.initials}>
      <ApplicationsContent applications={applications} loadError={error} />
    </AdminLayout>
  );
}
