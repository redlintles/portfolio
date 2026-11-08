import type { ReactNode } from "react";
import { Header, Footer } from "@/components/shell";
import { dictionary, type Language } from "@/lib/content";

/** Shared semantic frame places all main page content inside a centered container. */
export function SiteFrame({ language, children }: { language: Language; children: ReactNode }) {
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
