"use client";

import Link from "next/link";
import { useEffect } from "react";
import site from "@/locale/site.json";
import { usePathname } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import type { Dictionary, Language } from "@/lib/content";

/** Shared navigation preserves the current page when switching languages. */
export function Header({ language, copy }: { language: Language; copy: Dictionary }) {
  const pathname = usePathname();
  // Keep the document language accurate after client-side language navigation.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const routes = ["", "/about", "/projects", "/contact"];
  const parts = pathname.split("/").filter(Boolean);
  // Page path without the language segment; unprefixed addresses use the default language.
  const languageIndex = parts.indexOf(language);
  const suffix = languageIndex >= 0 ? parts.slice(languageIndex + 1).join("/") : parts.join("/");
  return (
    <header className="header">
      <Link href={`/${language}/`} className="header__brand" aria-label={copy.name}>
        {copy.brand}
        <span className="header__descriptor">{copy.portfolio}</span>
      </Link>
      <nav className="header__nav" aria-label={copy.portfolio}>
        {routes.map((route, index) => (
          <Link
            className="header__link"
            aria-current={(suffix ? `/${suffix}` : "") === route ? "page" : undefined}
            href={`/${language}${route}/`}
            key={route}
          >
            {copy.nav[index]}
          </Link>
        ))}
      </nav>
      <div className="header__languages" role="group" aria-label={copy.language}>
        {(["pt-BR", "en", "es"] as const).map((item) => (
          <Link
            href={`/${item}/${suffix}${suffix ? "/" : ""}`}
            hrefLang={item}
            lang={item}
            className="header__language"
            aria-current={item === language ? "true" : undefined}
            key={item}
          >
            {site.languageLabels[item]}
          </Link>
        ))}
      </div>
    </header>
  );
}

/** Footer keeps the contact invitation visible across all content pages. */
export function Footer({ language, copy }: { language: Language; copy: Dictionary }) {
  return (
    <footer className="footer">
      <div className="footer__invitation">
        <h2>{copy.contactTitle}</h2>
        <Link className="button" href={`/${language}/contact/`}>
          {copy.contactAction}
          <FiArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <div className="footer__bottom">
        <span>{copy.name}</span>
        <span>{copy.footer}</span>
        <a href="https://github.com/redlintles">
          {copy.contactLabels[2]} <FiArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
