import type { Metadata } from "next";
import StaffPortalLayout from "@/components/staff/StaffPortalLayout";
import LoginForm from "@/components/staff/LoginForm";

export const metadata: Metadata = {
  title: "Staff Portal — LUNEX TECH",
  description: "Internal LUNEX TECH staff workspace access.",
  robots: { index: false, follow: false },
};

export default function StaffPortalPage() {
  return (
    <StaffPortalLayout>
      <div className="grid flex-1 grid-cols-1 items-center gap-16 px-6 py-12 md:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-0">
        {/* Left: brand headline + technical detail */}
        <div className="staff-fade flex flex-col">
          <h1 className="font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[7vw] lg:text-[3.8vw] xl:text-[3.4rem]">
            WELCOME BACK.
          </h1>
          <p className="mt-3 font-display text-[9vw] font-black leading-[0.98] tracking-tight text-soft-white sm:text-[5.5vw] lg:text-[2.8vw] xl:text-[2.4rem]">
            ACCESS THE <span className="text-accent">WORKSPACE.</span>
          </p>

          <div className="mt-10 flex items-center gap-4 border-l border-line pl-5 lg:mt-14">
            <p className="text-xs leading-relaxed text-soft-white/50 sm:text-sm">
              Sign in with your LUNEX TECH staff credentials to reach internal
              tools, projects and systems.
            </p>
          </div>
        </div>

        {/* Right: login panel */}
        <div className="staff-fade border border-line p-7 sm:p-10 lg:p-12">
          <LoginForm />
        </div>
      </div>
    </StaffPortalLayout>
  );
}
