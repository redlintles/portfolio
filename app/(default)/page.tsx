import Home from "../[language]/page";
import { defaultLanguage } from "@/lib/content";

/** `/` renders the home page in the default language. */
export default function DefaultHome() {
  return <Home params={Promise.resolve({ language: defaultLanguage })} />;
}
