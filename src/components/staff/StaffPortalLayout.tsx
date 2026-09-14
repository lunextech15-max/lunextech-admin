import Link from "next/link";
import type { ReactNode } from "react";
import "@/styles/staff-login.css";

export default function StaffPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-carbon">
      <div className="staff-grid" aria-hidden />
      <div className="staff-grain" aria-hidden />
      <div className="staff-glow" aria-hidden />

      <header className="staff-fade relative z-10 flex items-center justify-between px-6 py-6 md:px-10 lg:px-16">
        <Link href="/" className="staff-logo text-base md:text-lg">
          LUNEX <span className="text-accent">TECH</span>
        </Link>

        <span className="text-right text-[10px] font-medium tracking-[0.3em] text-soft-white/35 uppercase">
          Internal system
          <span className="text-accent"> / 01</span>
        </span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">{children}</main>

      <footer className="staff-fade relative z-10 px-6 py-6 text-center md:px-10 lg:px-16">
        <p className="text-[10px] font-medium tracking-[0.25em] text-soft-white/30 uppercase">
          Authorized personnel only.
        </p>
      </footer>
    </div>
  );
}
