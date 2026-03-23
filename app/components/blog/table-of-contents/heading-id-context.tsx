"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { slugify } from "../../../lib/slugify";
import type { HeadingItem } from "./extract-headings";

function getTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getTextFromChildren).join("");
  if (React.isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    return getTextFromChildren(props.children);
  }
  return "";
}

type HeadingIdContextValue = {
  headings: HeadingItem[];
  registerHeading: (children: React.ReactNode, level: 1 | 2 | 3) => string;
};

const HeadingIdContext = createContext<HeadingIdContextValue | null>(null);

export function HeadingIdProvider({
  headings,
  children,
}: {
  headings: HeadingItem[];
  children: ReactNode;
}) {
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
  }, [headings]);

  const registerHeading = useCallback(
    (children: React.ReactNode, level: 1 | 2 | 3): string => {
      const item = headings[indexRef.current];
      indexRef.current += 1;
      if (item) return item.id;
      return slugify(getTextFromChildren(children)) || `heading-${indexRef.current}`;
    },
    [headings]
  );

  return (
    <HeadingIdContext.Provider value={{ headings, registerHeading }}>
      {children}
    </HeadingIdContext.Provider>
  );
}

export function useHeadingId() {
  return useContext(HeadingIdContext);
}

export { getTextFromChildren };
