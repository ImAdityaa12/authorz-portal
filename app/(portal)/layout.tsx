"use client";

import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Sidebar } from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CircleNotch } from "@phosphor-icons/react";

function PortalGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <CircleNotch size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar />
      <main className="flex-1 lg:pl-0 pl-0">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PortalGuard>{children}</PortalGuard>
    </AuthProvider>
  );
}
