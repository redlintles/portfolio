import { notFound } from "next/navigation";
import { dictionary, isLanguage, projects } from "@/lib/content";
import { ProjectExplorer } from "@/components/projects";

/** The complete project index includes browser-side filtering without a backend. */
export default async function ProjectsPage({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  if (!isLanguage(language)) notFound();
  const copy = dictionary(language);
  return (
    <section className="page">
      <p className="section__eyebrow">{copy.nav[2]}</p>
      <h1>{copy.projectsTitle}</h1>
      <p className="page__intro">{copy.projectsBody}</p>
      <ProjectExplorer projects={projects()} copy={copy} language={language} />
    </section>
  );
}
