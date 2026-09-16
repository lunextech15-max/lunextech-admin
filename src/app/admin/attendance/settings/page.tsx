import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import AttendanceSettingsContent from "@/components/admin/attendance/AttendanceSettingsContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAttendanceSettings } from "@/lib/admin/attendance";

export const metadata: Metadata = {
  title: "Attendance Settings — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminAttendanceSettingsPage() {
  const [identity, settings] = await Promise.all([getAdminIdentity(), getAttendanceSettings()]);

  return (
    <AdminLayout active="attendance" adminName={identity.name} adminInitials={identity.initials}>
      <AttendanceSettingsContent settings={settings} />
    </AdminLayout>
  );
}
