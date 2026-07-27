import type { Metadata } from "next";
import { generatePageMetadata } from "./lib/metadata";
import { EditionSection } from "./components/edition/edition-section";

export const metadata: Metadata = generatePageMetadata("/");

/**
 * Sem isto o Next prerenderiza no build e a data congela na data do deploy — a
 * página passaria a mentir sobre a única coisa que a define.
 */
export const dynamic = "force-dynamic";

export default function Home() {
  const printedOn = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeZone: "America/Fortaleza",
  }).format(new Date());

  return <EditionSection printedOn={printedOn} />;
}
