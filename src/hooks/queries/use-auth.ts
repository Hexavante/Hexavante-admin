"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/api-url";

const API_URL = getApiUrl();

// Types
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  username: string | null;
  roles: string[];
}

export interface Session {
  user: SessionUser | null;
  session?: {
    expiresAt: string;
  };
}

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

// Hooks
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async (): Promise<Session | null> => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/session`, {
          credentials: "include",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user ? data : null;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to sign out");
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session(), null);
      window.location.href = "/login";
    },
  });
}

export function useIsAuthenticated() {
  const { data: session, isLoading } = useSession();
  return {
    isAuthenticated: Boolean(session?.user),
    isLoading,
    user: session?.user ?? null,
  };
}

export function useHasRole(role: string) {
  const { user } = useIsAuthenticated();
  return user?.roles.includes(role) ?? false;
}

export function useIsAdmin() {
  const { user } = useIsAuthenticated();
  return user?.roles.some((r) => ["ADMIN", "SUPERADMIN"].includes(r)) ?? false;
}
