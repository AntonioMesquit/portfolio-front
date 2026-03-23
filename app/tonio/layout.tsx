import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata("/tonio");

export default function TonioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
