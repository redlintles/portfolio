import ProjectsPage from "../../[language]/projects/page";
import { defaultLanguage } from "@/lib/content";

/** `/projects/` renders the project index in the default language. */
export default function DefaultProjects() {
  return <ProjectsPage params={Promise.resolve({ language: defaultLanguage })} />;
}
