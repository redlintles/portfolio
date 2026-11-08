import type { Dictionary, Project } from "@/lib/content";
import { translate } from "@/lib/content";
import { mediaUrl, projectMediaUrl } from "@/lib/media";

/**
 * Project gallery for the detail page: screenshots in a fixed-size grid with the caption
 * revealed on hover or keyboard focus, followed by demonstration videos with native controls.
 * Rendered on the server; no client JavaScript is required.
 */
export function ProjectGallery({ project, copy }: { project: Project; copy: Dictionary }) {
  const hasImages = project.image_links.length > 0;
  const hasVideos = project.video_links.length > 0;
  const name = translate(copy, project.project_name);
  return (
    <section className="gallery" aria-labelledby="project-gallery">
      <h2 className="gallery__title" id="project-gallery">
        {copy.gallery}
      </h2>

      {hasImages && (
        <>
          <h3 className="gallery__subtitle">{copy.images}</h3>
          <ul className="gallery__grid">
            {project.image_links.map((image, index) => {
              const description = translate(copy, image.description);
              return (
                <li key={`${index}-${image.link.slice(0, 30)}`}>
                  {/* Focusable so keyboard users can reveal the caption as well. */}
                  <figure className="gallery__item" tabIndex={0}>
                    <img
                      className="gallery__image"
                      src={projectMediaUrl(image.link)}
                      alt={description}
                      loading="lazy"
                    />
                    {/* The alt text already announces the description to screen readers. */}
                    <figcaption
                      className="gallery__caption gallery__caption--reveal"
                      aria-hidden="true"
                    >
                      {description}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Conceptual artwork stands in for screenshots; its label is always visible. */}
      {!hasImages && project.illustration_link && (
        <ul className="gallery__grid">
          <li>
            <figure className="gallery__item">
              <img
                className="gallery__image"
                src={mediaUrl(project.illustration_link)}
                alt={`${name} — ${copy.illustration}`}
              />
              <figcaption className="gallery__caption">{copy.illustration}</figcaption>
            </figure>
          </li>
        </ul>
      )}

      {!hasImages && !project.illustration_link && !hasVideos && (
        <p className="gallery__placeholder">{copy.noImages}</p>
      )}

      {hasVideos && (
        <>
          <h3 className="gallery__subtitle">{copy.video}</h3>
          <ul className="gallery__grid gallery__grid--videos">
            {project.video_links.map((video, index) => {
              const source = projectMediaUrl(video.link);
              return (
                <li key={`${index}-${video.link}`}>
                  <figure className="gallery__video">
                    <video className="gallery__player" src={source} controls preload="metadata">
                      {/* Shown only by browsers that cannot play the file. */}
                      <a href={source}>{copy.videoFallback}</a>
                    </video>
                    <figcaption className="gallery__video-caption">
                      {translate(copy, video.description)}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
