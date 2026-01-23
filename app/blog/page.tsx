import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata("/blog");

export default function Blog() {
  return (
    <div className="min-h-screen w-full text-white">
      <h1>Blog</h1>
    </div>
  );
}
