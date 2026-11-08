"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowUpRight, FiCode } from "react-icons/fi";
import type { Dictionary, Language, Project } from "@/lib/content";
import { mediaUrl, projectMediaUrl } from "@/lib/media";

/** Resolve project copy in a client-safe way without importing filesystem code. */
function projectCopy(copy: Dictionary, project: Project) {
  return copy.projects[project.slug as keyof typeof copy.projects];
}

/** Rectangular project tile reveals its summary on pointer hover or keyboard focus. */
export function ProjectCard({
  project,
  copy,
  language,
  featured = false,
}: {
  project: Project;
  copy: Dictionary;
  language: Language;
  featured?: boolean;
}) {
  const text = projectCopy(copy, project);
  // Real screenshots take priority over the optional conceptual illustration.
  let src: string | undefined;
  if (project.image_links.length) src = projectMediaUrl(project.image_links[0].link);
  else if (project.illustration_link) src = mediaUrl(project.illustration_link);
  return (
    <article className={`project-card${featured ? " project-card--featured" : ""}`}>
      <div className="project-card__visual" aria-hidden="true">
        {src ? (
          <img src={src} alt="" loading="lazy" />
        ) : (
          <>
            <FiCode />
            <span>{project.technologies.join(" / ")}</span>
          </>
        )}
      </div>
      <div className="project-card__body">
        {!project.image_links.length && project.illustration_link && (
          <p className="project-card__caption">{copy.illustration}</p>
        )}
        <div className="project-card__heading">
          <h3>{text.project_name}</h3>
          <FiArrowUpRight aria-hidden="true" />
        </div>
        <p className="project-card__technologies">{project.technologies.join(" · ")}</p>
        <div className="project-card__reveal">
          <p>{text.description}</p>
          <Link className="button" href={`/${language}/projects/${project.slug}/`}>
            {copy.details}
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Accessible filters and search work entirely in the statically exported browser app. */
export function ProjectExplorer({
  projects,
  copy,
  language,
}: {
  projects: Project[];
  copy: Dictionary;
  language: Language;
}) {
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const visible = projects.filter((project) => {
    const matchesType = filter === 0 || project.type === (filter === 1 ? "Primary" : "Secondary");
    const searchable = `${projectCopy(copy, project).project_name} ${project.technologies.join(
      " ",
    )}`;
    return matchesType && searchable.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim());
  });
  return (
    <>
      <div className="explorer">
        <div className="explorer__filters">
          {copy.filters.map((label, index) => (
            <button
              className="explorer__filter"
              aria-pressed={filter === index}
              onClick={() => setFilter(index)}
              key={label}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="explorer__search">
          <span className="accessibility__only">{copy.search}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            type="search"
          />
        </label>
      </div>
      <div className="project-grid">
        {visible.map((project) => (
          <ProjectCard key={project.slug} {...{ project, copy, language }} />
        ))}
      </div>
      {visible.length === 0 && <p role="status">{copy.empty}</p>}
    </>
  );
}
