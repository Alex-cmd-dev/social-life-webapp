/**
 * Providers Component
 *
 * This component wraps the app with necessary context providers.
 * Currently includes SessionProvider from NextAuth for authentication.
 *
 * Add more providers here as needed (theme, state management, etc.)
 */

"use client";

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
