import type { ReactNode } from "react";

/** Schemes handed to another application (mail client, phone); a new tab would stay blank. */
const APPLICATION_SCHEMES = ["mailto:", "tel:"];

/**
 * Link that leaves the portfolio. Web addresses open in a new tab with
 * `rel="noopener noreferrer"`, so the opened page cannot control this one, and a visually
 * hidden note tells screen reader users about the new tab. `mailto:` and `tel:` links
 * keep the default behaviour.
 */
export function ExternalLink({
  href,
  newTabLabel,
  className,
  children,
}: {
  href: string;
  /** Localized note such as "(opens in a new tab)". */
  newTabLabel: string;
  className?: string;
  children: ReactNode;
}) {
  if (APPLICATION_SCHEMES.some((scheme) => href.startsWith(scheme))) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="accessibility__only"> {newTabLabel}</span>
    </a>
  );
}
