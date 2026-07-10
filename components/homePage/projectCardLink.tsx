"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { ReactNode } from "react";

export function ProjectCardLink({
  href,
  slug,
  ariaLabel,
  className,
  children,
}: {
  href: string;
  slug: string;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={() => trackEvent("button_click", { id: "view_project", project: slug })}
    >
      {children}
    </Link>
  );
}
