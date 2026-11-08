import About from "../../[language]/about/page";
import { defaultLanguage } from "@/lib/content";

/** `/about/` renders the about page in the default language. */
export default function DefaultAbout() {
  return <About params={Promise.resolve({ language: defaultLanguage })} />;
}
