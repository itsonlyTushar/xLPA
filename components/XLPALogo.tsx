"use client";

import Link from "next/link";

interface XLPALogoProps {
  isCollapsed?: boolean;
  className?: string;
  href?: string;
  showLogoOnly?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function XLPALogo({
  isCollapsed = false,
  className = "",
  href = "/dashboard",
  showLogoOnly = false,
  size = "md",
}: XLPALogoProps) {
  const sizeClasses = {
    xs: "text-base",
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
    "2xl": "text-6xl",
  } as const;

  const logoContent = (
    <span
      className={`font-bold tracking-tight font-playfair ${sizeClasses[size]} ${className}`}
    >
      <span className="font-pacifico font-normal lowercase mx-1">x</span>
      {!isCollapsed && <span>LPA</span>}
    </span>
  );

  if (showLogoOnly) {
    return logoContent;
  }

  return (
    <Link href={href} className="flex items-center gap-2 group">
      {logoContent}
    </Link>
  );
}
