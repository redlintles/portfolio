import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/shell";
import { dictionary, isLanguage, languages } from "@/lib/content";

/** Prebuild all supported language branches and reject unknown runtime parameters. */
export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}
export const dynamicParams = false;

/** Localized metadata is computed from the same JSON files as page copy. */
export async function generateMetadata({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  if (!isLanguage(language)) notFound();
  const copy = dictionary(language);
  return {
    title: { default: `${copy.name} · ${copy.portfolio}`, template: `%s · ${copy.name}` },
    description: copy.heroBody,
  };
}

/** Shared semantic frame places all main page content inside a centered container. */
export default async function LanguageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  if (!isLanguage(language)) notFound();
  const copy = dictionary(language);
  return (
    <div lang={language} className="site">
      <a className="accessibility__skip" href="#content">
        {copy.skip}
      </a>
      <Header language={language} copy={copy} />
      <main id="content" className="main">
        {children}
      </main>
      <Footer language={language} copy={copy} />
    </div>
  );
}
