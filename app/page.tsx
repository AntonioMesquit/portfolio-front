import type { Metadata } from "next";
import { generatePageMetadata } from "./lib/metadata";

export const metadata: Metadata = generatePageMetadata("/");

export default function Home() {
  return (
    <div className="min-h-screen w-full text-white">
    </div>
  );
}
