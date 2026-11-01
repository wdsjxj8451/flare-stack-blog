import type { ReactNode } from "react";

/** Shared heading for the home, posts and tags pages. */
export function ListingHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="listing-heading fuwari-card-base border border-(--fuwari-meta-divider) p-6 sm:p-8">
      <h1 className="fuwari-text-90 text-2xl font-semibold tracking-tight wrap-anywhere sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="fuwari-text-75 mt-3 max-w-prose text-sm leading-7 wrap-anywhere sm:text-base">
          {description}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}
