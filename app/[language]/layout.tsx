import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/site-frame";
import { isLanguage, languages, siteMetadata } from "@/lib/content";

/** Prebuild all supported language branches and reject unknown runtime parameters. */
export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}
export const dynamicParams = false;

/** Localized metadata is computed from the same JSON files as page copy. */
export async function generateMetadata({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  if (!isLanguage(language)) notFound();
  return siteMetadata(language);
}

/** Wrap every localized page in the shared header, main container and footer. */
export default async function LanguageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  if (!isLanguage(language)) notFound();
  return <SiteFrame language={language}>{children}</SiteFrame>;
}
