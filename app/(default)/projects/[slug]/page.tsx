import ProjectPage from "../../../[language]/projects/[slug]/page";
import { defaultLanguage, projects } from "@/lib/content";

/** Each project JSON also gets an unprefixed detail page, e.g. `/projects/colour/`. */
export function generateStaticParams() {
  return projects().map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

/** Render the project detail page in the default language. */
export default async function DefaultProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectPage params={Promise.resolve({ language: defaultLanguage, slug })} />;
}
