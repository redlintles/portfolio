import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import { dictionary, isLanguage, projects, translate } from "@/lib/content";
import { ProjectGallery } from "@/components/gallery";
import { ExternalLink } from "@/components/external-link";

/** Each JSON creates a detail page in every language during static generation. */
export function generateStaticParams() {
  return projects().map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

/** Render publication links, the media gallery, and documented outcomes. */
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
        <ExternalLink
          className="button button--solid"
          href={project.github_repo}
          newTabLabel={copy.newTab}
        >
          {copy.source}
          <FiArrowUpRight aria-hidden="true" />
        </ExternalLink>
        {project.project_link && (
          <ExternalLink className="button" href={project.project_link} newTabLabel={copy.newTab}>
            {copy.live}
            <FiArrowUpRight aria-hidden="true" />
          </ExternalLink>
        )}
      </div>
      {!project.project_link && <p className="page__notice">{copy.offline}</p>}
      <ProjectGallery project={project} copy={copy} />
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
