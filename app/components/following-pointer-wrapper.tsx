"use client";

import { FollowerPointerCard } from "./ui/following-pointer";

export function FollowingPointerWrapper({ children }: { children: React.ReactNode }) {
  return (
    <FollowerPointerCard hideTitle className="min-h-screen">
      {children}
    </FollowerPointerCard>
  );
}
