import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PeopleContent from "@/components/admin/people/PeopleContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllPeople, getSupervisorOptions, getNextStaffIds } from "@/lib/admin/team";

export const metadata: Metadata = {
  title: "People — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminPeoplePage() {
  const identity = await getAdminIdentity();

  const [{ people, error }, supervisors, { nextStaffId, nextInternId, nextCallerId }] = await Promise.all([
    getAllPeople(),
    getSupervisorOptions(),
    getNextStaffIds(),
  ]);

  return (
    <AdminLayout active="people" adminName={identity.name} adminInitials={identity.initials}>
      <Suspense fallback={null}>
        <PeopleContent
          initialPeople={people}
          loadError={error}
          nextStaffId={nextStaffId}
          nextInternId={nextInternId}
          nextCallerId={nextCallerId}
          supervisors={supervisors}
        />
      </Suspense>
    </AdminLayout>
  );
}
