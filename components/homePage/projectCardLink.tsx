"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ReactNode } from "react";

// Makes a whole project card a single clickable link while preserving the
// `view_project` analytics event (the section itself is a server component, so
// the click handler has to live in this client boundary).
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
      onClick={() => track("button_click", { id: "view_project", project: slug })}
    >
      {children}
    </Link>
  );
}
