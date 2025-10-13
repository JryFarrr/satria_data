'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

function SheetNavButton({
  href,
  label,
  active,
  hideOnMobile,
}: {
  href: string;
  label: string;
  active: boolean;
  hideOnMobile?: boolean;
}) {
  const baseClasses =
    "items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors";
  const activeClasses = "bg-[#1766ff] text-white";
  const inactiveClasses =
    "text-[#1f2355] hover:bg-[#e3e7ff] focus-visible:bg-[#e3e7ff]";
  const mobileClasses = hideOnMobile ? "hidden sm:flex" : "flex";

  return (
    <Link
      href={href}
      className={`${mobileClasses} ${baseClasses} ${
        active ? activeClasses : inactiveClasses
      }`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-[14px] w-60 overflow-hidden rounded-full lg:w-full">
        <div className="w-1/3 bg-[#f4b400]" />
        <div className="w-1/3 bg-[#1766ff]" />
        <div className="w-1/3 bg-[#1f2c6d]" />
      </div>
      <header className="space-y-2 text-center lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1766ff]">
          Analitik Sosial
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-between">
          <h1 className="text-[2.45rem] font-semibold text-[#1f2355]">
            Content Engagement Dashboard
          </h1>
        </div>
      </header>

      <nav
        aria-label="Sheet navigation"
        className="flex flex-wrap items-center gap-2 rounded-full bg-white/70 p-2 shadow-sm backdrop-blur"
      >
        <SheetNavButton href="/" label="Sheet 1" active={pathname === "/"} />
        <SheetNavButton
          href="/sheet2"
          label="Sheet 2"
          active={pathname === "/sheet2"}
          hideOnMobile
        />
      </nav>
    </div>
  );
}
