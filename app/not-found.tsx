import Link from "next/link";
import copy from "@/locale/pt-BR.json";

/** GitHub Pages uses the root Portuguese fallback for unknown static addresses. */
export default function NotFound() {
  return (
    <main className="entry">
      <p className="section__eyebrow">{copy.portfolio}</p>
      <h1>{copy.notFoundTitle}</h1>
      <p>{copy.notFoundBody}</p>
      <Link className="button" href="/pt-BR/projects/">
        {copy.explore}
      </Link>
    </main>
  );
}
