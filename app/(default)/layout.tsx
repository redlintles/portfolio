import type { ReactNode } from "react";
import { SiteFrame } from "@/components/site-frame";
import { defaultLanguage, siteMetadata } from "@/lib/content";

/**
 * Addresses without a language prefix (`/`, `/about/`, `/projects/`, ...) render the
 * default language. The `(default)` folder is a route group: it adds no URL segment.
 */
export const metadata = siteMetadata(defaultLanguage);

/** Same frame as the localized routes, fixed to the default language. */
export default function DefaultLanguageLayout({ children }: { children: ReactNode }) {
  return <SiteFrame language={defaultLanguage}>{children}</SiteFrame>;
}
