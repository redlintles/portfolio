import pt from "@/locale/pt-BR.json";
import type { ReactNode } from "react";
import "./globals.css";

/** Root metadata also covers the unprefixed Portuguese entry. */
export const metadata = { title: pt.name, description: pt.heroBody };

/** Each language route supplies its own document language through its content wrapper. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
