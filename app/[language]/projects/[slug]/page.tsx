import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import { dictionary, isLanguage, projects, translate, mediaUrl } from "@/lib/content";

/** Each JSON creates a detail page in every language during static generation. */
export function generateStaticParams() {
  return projects().map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

/** Render project media, publication links, and documented outcomes. */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ language: string; slug: string }>;
}) {
  const { language, slug } = await params;
  if (!isLanguage(language)) notFound();
  const project = projects().find((item) => item.slug === slug);
  if (!project) notFound();
  const copy = dictionary(language);
  return (
    <article className="page">
      <Link className="section__link" href={`/${language}/projects/`}>
        {copy.back}
      </Link>
      <p className="section__eyebrow">{project.technologies.join(" / ")}</p>
      <h1>{translate(copy, project.project_name)}</h1>
      <p className="page__intro">{translate(copy, project.description)}</p>
      <div className="page__actions">
        <a className="button button--solid" href={project.github_repo}>
          {copy.source}
          <FiArrowUpRight aria-hidden="true" />
        </a>
        {project.project_link && (
          <a className="button" href={project.project_link}>
            {copy.live}
            <FiArrowUpRight aria-hidden="true" />
          </a>
        )}
        {project.video_link && (
          <a className="button" href={project.video_link}>
            {copy.video}
            <FiArrowUpRight aria-hidden="true" />
          </a>
        )}
      </div>
      {!project.project_link && <p className="page__notice">{copy.offline}</p>}
      <section className="detail__gallery" aria-label={copy.gallery}>
        {project.image_links.length ? (
          project.image_links.map((image, index) => (
            <img
              key={`${index}-${image.slice(0, 30)}`}
              src={mediaUrl(image)}
              alt={`${translate(copy, project.project_name)} — ${copy.gallery} ${index + 1}`}
              loading="lazy"
            />
          ))
        ) : project.illustration_link ? (
          <figure className="detail__illustration">
            <img
              src={mediaUrl(project.illustration_link)}
              alt={`${translate(copy, project.project_name)} — ${copy.illustration}`}
            />
            <figcaption>{copy.illustration}</figcaption>
          </figure>
        ) : (
          <p className="detail__placeholder">{copy.noImages}</p>
        )}
      </section>
      <div className="detail__columns">
        <section>
          <h2>{copy.successes}</h2>
          <p>{translate(copy, project.successes)}</p>
        </section>
        {translate(copy, project.failures).trim() && (
          <section>
            <h2>{copy.failures}</h2>
            <p>{translate(copy, project.failures)}</p>
          </section>
        )}
      </div>
    </article>
  );
}
