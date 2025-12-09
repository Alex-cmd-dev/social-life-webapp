"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Search, User, LogOut, Package, Bookmark } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">IdeaBox</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/feed"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === "/feed" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Feed
            </Link>
            <Link
              href="/following"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === "/following"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Following
            </Link>
            {session && (
              <>
                <Link
                  href="/projects"
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    pathname === "/projects"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Projects
                </Link>
                <Link
                  href="/bookmarks"
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    pathname === "/bookmarks"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Bookmarks
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/search">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {session && (
            <Link href="/bookmarks" className="sm:hidden">
              <Button variant="ghost" size="icon" title="Bookmarks">
                <Bookmark className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {status === "loading" ? (
            <Button variant="ghost" size="sm" disabled>
              Loading...
            </Button>
          ) : session ? (
            <>
              <Link
                href={`/profile/${session.user?.id}`}
                className="hidden sm:flex"
              >
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">
                    {session.user?.name || session.user?.email}
                  </span>
                </Button>
              </Link>
              <Link href={`/profile/${session.user?.id}`} className="sm:hidden">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut({ redirect: false });
                  window.location.href = "/";
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="hidden sm:inline-block">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
