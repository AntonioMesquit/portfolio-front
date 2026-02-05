import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import ProjectsSection from "../components/projects/projects-section";

export const metadata: Metadata = generatePageMetadata("/projetos");

export default function Projetos() {
  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      <ProjectsSection />
    </div>
  );
}
