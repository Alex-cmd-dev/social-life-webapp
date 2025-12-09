"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  Lightbulb,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to feed
    if (status === "authenticated" && session) {
      router.push("/feed");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <Package className="h-7 w-7 text-white" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">IdeaBox</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-br from-purple-600 to-pink-600"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 items-center justify-center mb-6">
                <Package className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Share Your Ideas with the World
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              IdeaBox is the platform where creativity meets community. Share
              your ideas, get valuable feedback, and follow inspiring projects.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-br from-purple-600 to-pink-600 px-8 text-lg h-12"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 text-lg h-12"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="h-12 w-12 rounded-lg bg-purple-600/10 flex items-center justify-center mb-4 mx-auto">
                  <Lightbulb className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Share Ideas</h3>
                <p className="text-muted-foreground text-sm">
                  Post your innovative ideas and projects to inspire others and
                  get constructive feedback.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="h-12 w-12 rounded-lg bg-pink-600/10 flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Build Community</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with like-minded creators, collaborate, and grow
                  together in a supportive community.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="h-12 w-12 rounded-lg bg-purple-600/10 flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                <p className="text-muted-foreground text-sm">
                  Follow projects you love, track their progress, and celebrate
                  milestones together.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">IdeaBox</span>
              </div>
              <p className="text-sm text-muted-foreground">
                &copy; 2025 IdeaBox. Share ideas, build community.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return null;
}
