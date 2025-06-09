"use client";
import { Authenticated } from "convex/react";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Authenticated>
      <div className="container mx-auto mt-24 mb-20">{children}</div>
    </Authenticated>
  );
}
