import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { dictionary, isLanguage, projects, mediaUrl } from "@/lib/content";
import { ProjectCard } from "@/components/projects";
import { Technologies } from "@/components/technologies";
import site from "@/locale/site.json";

/** Home presents the portfolio as a progression from introduction to selected work. */
export default async function Home({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  if (!isLanguage(language)) notFound();
  const copy = dictionary(language);
  const all = projects();
  return (
    <>
      <section className="hero">
        <div className="hero__copy">
          <p className="section__eyebrow">{copy.heroEyebrow}</p>
          <h1>
            {copy.heroTitle[0]}
            <span>{copy.heroTitle[1]}</span>
          </h1>
          <p className="hero__description">{copy.heroBody}</p>
          <div className="hero__actions">
            <Link className="button button--solid" href={`/${language}/projects/`}>
              {copy.explore}
              <FiArrowUpRight aria-hidden="true" />
            </Link>
            <Link className="hero__link" href={`/${language}/about/`}>
              {copy.aboutLink}
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="hero__image">
          <img src={mediaUrl(site.image.src)} alt={copy.imageAlt} fetchPriority="high" />
          <figcaption>
            <a href={site.image.source}>{copy.imageCredit}</a>
          </figcaption>
          <FiArrowDownRight className="hero__arrow" aria-hidden="true" />
        </figure>
      </section>
      <section className="section" aria-labelledby="selected-title">
        <div className="section__heading">
          <div>
            <p className="section__eyebrow">{copy.selected}</p>
            <h2 id="selected-title">{copy.selectedTitle}</h2>
          </div>
          <Link className="section__link" href={`/${language}/projects/`}>
            {copy.allProjects}
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="featured-grid">
          {all
            .filter((project) => project.type === "Primary")
            .map((project) => (
              <ProjectCard key={project.slug} {...{ project, copy, language }} featured />
            ))}
        </div>
      </section>
      <section className="section" aria-labelledby="tech-title">
        <p className="section__eyebrow">{copy.techLabel}</p>
        <h2 id="tech-title">{copy.techTitle}</h2>
        <p className="section__description">{copy.techBody}</p>
        <Technologies copy={copy} />
      </section>
      <section className="section" aria-labelledby="secondary-title">
        <p className="section__eyebrow">{copy.secondaryLabel}</p>
        <h2 id="secondary-title">{copy.secondaryTitle}</h2>
        <div className="metro-grid">
          {all
            .filter((project) => project.type === "Secondary")
            .map((project) => (
              <ProjectCard key={project.slug} {...{ project, copy, language }} />
            ))}
        </div>
      </section>
      <section className="section" aria-labelledby="education-title">
        <p className="section__eyebrow">{copy.educationLabel}</p>
        <h2 id="education-title">{copy.educationTitle}</h2>
        <div className="education">
          {copy.education.map((item) => (
            <article className="education__item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <FiArrowUpRight aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
