import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PeopleContent from "@/components/admin/people/PeopleContent";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { getAllPeople, STAFF_LUNEX_IDS, ADMIN_INTERNS } from "@/lib/admin/people-data";
import { MOCK_TEAM } from "@/lib/staff/team-data";

export const metadata: Metadata = {
  title: "People — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default function AdminPeoplePage() {
  const nextStaffNumber = Object.keys(STAFF_LUNEX_IDS).length + 1;
  const nextInternNumber = ADMIN_INTERNS.length + 1;

  return (
    <AdminLayout active="people" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <Suspense fallback={null}>
        <PeopleContent
          initialPeople={getAllPeople()}
          nextStaffId={`LX-${String(nextStaffNumber).padStart(3, "0")}`}
          nextInternId={`IN-${String(nextInternNumber).padStart(3, "0")}`}
          supervisors={MOCK_TEAM.map((m) => ({ lunexId: STAFF_LUNEX_IDS[m.initials], name: m.name }))}
        />
      </Suspense>
    </AdminLayout>
  );
}
