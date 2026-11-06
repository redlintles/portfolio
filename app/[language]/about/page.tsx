import { notFound } from "next/navigation";
import { dictionary, isLanguage } from "@/lib/content";

/** Long-form biography uses only the owner's supplied history, translated locally. */
export default async function About({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  if (!isLanguage(language)) notFound();
  const copy = dictionary(language);
  return (
    <article className="page">
      <p className="section__eyebrow">{copy.nav[1]}</p>
      <h1>{copy.aboutTitle}</h1>
      <p className="page__intro">{copy.aboutIntro}</p>
      <div className="biography">
        {copy.aboutParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
