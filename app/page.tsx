import Home from "./[language]/page";
import { Header, Footer } from "@/components/shell";
import { dictionary } from "@/lib/content";

/** Render the Portuguese home at the domain entry. */
export default function Entry() {
  const copy = dictionary("pt-BR");
  return (
    <div className="site">
      <a className="accessibility__skip" href="#content">
        {copy.skip}
      </a>
      <Header language="pt-BR" copy={copy} />
      <main id="content" className="main">
        <Home params={Promise.resolve({ language: "pt-BR" })} />
      </main>
      <Footer language="pt-BR" copy={copy} />
    </div>
  );
}
