import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import ProjectsSection from "../components/projects/projects-section";

export const metadata: Metadata = generatePageMetadata("/projetos");

export default function Projetos() {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden projects-page relative">
      <ProjectsSection />
    </div>
  );
}
