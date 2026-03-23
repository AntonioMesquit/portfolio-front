import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata("/sobre-o-site");

export default function SobreOSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
