"use client";

import { SessionProvider } from "next-auth/react";

export default function DashboardProviders({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
