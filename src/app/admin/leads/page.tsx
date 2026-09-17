import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import LeadsContent from "@/components/admin/leads/LeadsContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllLeads, getCallerOptions } from "@/lib/admin/leads";
import { getAllScripts } from "@/lib/admin/scripts";

export const metadata: Metadata = {
  title: "Leads — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  const identity = await getAdminIdentity();
  const [leads, scripts, callers] = await Promise.all([getAllLeads(), getAllScripts(), getCallerOptions()]);

  return (
    <AdminLayout active="leads" adminName={identity.name} adminInitials={identity.initials}>
      <Suspense fallback={null}>
        <LeadsContent leads={leads} scripts={scripts} callers={callers} adminStaffId={identity.lunexId} />
      </Suspense>
    </AdminLayout>
  );
}
