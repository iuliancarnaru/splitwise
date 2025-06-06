"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Header() {
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useCurrentUser();

  return (
    <header className="w-full fixed top-0 border-b bg-white/95 backdrop-blur z-50 supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/splitwise.svg"
            alt="splitwise logo"
            width={100}
            height={40}
            className="h-6 w-auto object-contain"
          />
        </Link>
        {pathname === "/" ? (
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-green-600 transition"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-green-600 transition"
            >
              How it works
            </Link>
          </div>
        ) : null}
        <div className="flex items-center gap-4">
          <Authenticated>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex gap-2 hover:text-green-600 hover:border-green-600 transition hover:bg-white cursor-pointer"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Button>

              <Button variant="ghost" className="md:hidden size-10 p-0">
                <LayoutDashboard className="size-4" />
              </Button>
            </Link>
            <UserButton />
          </Authenticated>
          <Unauthenticated>
            <SignInButton>
              <Button variant="outline" className="cursor-pointer">
                Sing in
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-green-600 hover:bg-green-700 border-none cursor-pointer text-white">
                Get started
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
      </nav>
      {isLoading ? (
        <BarLoader width={"100%"} height={"1px"} color="#36d7b7" />
      ) : null}
    </header>
  );
}
