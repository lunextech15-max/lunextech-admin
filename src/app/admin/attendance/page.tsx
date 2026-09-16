import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AttendanceContent from "@/components/admin/attendance/AttendanceContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllAttendance } from "@/lib/admin/attendance";
import { getAllPeople } from "@/lib/admin/team";

export const metadata: Metadata = {
  title: "Attendance — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminAttendancePage() {
  const identity = await getAdminIdentity();
  const [{ records, error }, { people }] = await Promise.all([getAllAttendance(), getAllPeople()]);

  return (
    <AdminLayout active="attendance" adminName={identity.name} adminInitials={identity.initials}>
      <Suspense fallback={null}>
        <AttendanceContent
          records={records}
          loadError={error}
          people={people.map((p) => ({ id: p.lunexId, name: p.name }))}
          markedBy={identity.lunexId}
        />
      </Suspense>
    </AdminLayout>
  );
}
