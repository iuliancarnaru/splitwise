import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex align-center justify-center pt-40">{children}</div>
  );
}
