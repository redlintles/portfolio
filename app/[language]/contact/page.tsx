import { notFound } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import { dictionary, isLanguage } from "@/lib/content";
import site from "@/locale/site.json";

/** Render the contact channels configured in site.json. */
export default async function Contact({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  if (!isLanguage(language)) notFound();
  const copy = dictionary(language);
  return (
    <section className="page">
      <p className="section__eyebrow">{copy.nav[3]}</p>
      <h1>{copy.contactTitle}</h1>
      <p className="page__intro">{copy.contactBody}</p>
      <div className="contacts">
        {site.contacts.map((contact, index) => (
          <a className="contacts__item" href={contact.href} key={contact.href}>
            <span className="contacts__label">{copy.contactLabels[index]}</span>
            <span className="contacts__value">{contact.value}</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
