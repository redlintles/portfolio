import Contact from "../../[language]/contact/page";
import { defaultLanguage } from "@/lib/content";

/** `/contact/` renders the contact page in the default language. */
export default function DefaultContact() {
  return <Contact params={Promise.resolve({ language: defaultLanguage })} />;
}
