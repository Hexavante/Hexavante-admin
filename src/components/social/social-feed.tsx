"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { FeedActivity } from "@/lib/social";
import { ActivityCard } from "./activity-card";
import { cn } from "@/lib/cn";
import { themeUi } from "@/lib/theme-ui";

type Props = {
  exploreActivities: FeedActivity[];
  followingActivities: FeedActivity[];
  canInteract: boolean;
  canModerate?: boolean;
  viewerId?: string;
  highlightPostId?: string;
};

type Tab = "explore" | "following";

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition hx-filter-pill",
        active ? themeUi.filterActive : themeUi.filterInactive,
      )}
    >
      {label}
    </button>
  );
}

export function SocialFeed({
  exploreActivities,
  followingActivities,
  canInteract,
  canModerate = false,
  viewerId,
  highlightPostId,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(highlightPostId ? "explore" : "explore");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!highlightPostId) return;
    const element = document.getElementById(`post-${highlightPostId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightPostId]);

  const rawActivities = useMemo(() => {
    if (tab === "following") return followingActivities;
    return exploreActivities;
  }, [exploreActivities, followingActivities, tab]);

  const activities = useMemo(() => {
    if (!searchQuery.trim()) return rawActivities;
    const q = searchQuery.toLowerCase();
    return rawActivities.filter(
      (a) =>
        a.metadata.title?.toLowerCase().includes(q) ||
        a.metadata.body?.toLowerCase().includes(q) ||
        a.user.fullName?.toLowerCase().includes(q) ||
        a.user.username?.toLowerCase().includes(q),
    );
  }, [rawActivities, searchQuery]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <div className={`flex flex-wrap gap-2 ${themeUi.tabNav}`}>
          {(
            [
              { value: "explore", label: "Explorar" },
              { value: "following", label: "Seguindo" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "min-h-11 px-4 py-2.5 text-sm transition",
                tab === value ? themeUi.tabActive : themeUi.tabInactive,
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <label className="relative min-w-0 flex-1 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 hx-text-subtle" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar por autor, título ou conteúdo..."
              className="hx-input w-full min-h-11 pl-10 pr-3"
            />
          </label>
        </div>

        {!canInteract && (
          <p className="mt-4 rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/0.35)] px-4 py-3 text-sm hx-text-muted">
            <Link
              href="/login?callbackUrl=/social"
              className="font-semibold hx-accent-link hover:underline"
            >
              Entre na sua conta
            </Link>{" "}
            para ver o feed de quem você segue.
          </p>
        )}

        <p className="mt-3 text-xs hx-text-subtle">
          {activities.length}{" "}
          {activities.length === 1 ? "publicação encontrada" : "publicações encontradas"}
        </p>

        <div className="mt-4 space-y-4">
          {activities.length === 0 ? (
            <div className="hx-empty mt-4 p-6 sm:p-10">
              <p className="font-semibold hx-text-body">
                {searchQuery
                  ? "Nenhum resultado para a busca."
                  : tab === "following"
                    ? "Nenhuma atividade de quem você segue."
                    : "Nenhuma atividade ainda."}
              </p>
              <p className="mt-1 text-sm hx-text-muted">
                {searchQuery
                  ? "Tente outra busca."
                  : tab === "following"
                    ? "Siga outros estudantes no ranking ou nos perfis."
                    : "Conclua cursos e simulados para aparecer aqui."}
              </p>
            </div>
          ) : (
            activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                canInteract={canInteract}
                canModerate={canModerate}
                viewerId={viewerId}
                highlight={highlightPostId === activity.id}
              />
            ))
          )}
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/0.35)] p-4">
            <h3 className="text-sm font-semibold hx-text-body">Feed Social</h3>
            <p className="mt-1 text-xs hx-text-muted">
              Veja as atividades dos estudantes da plataforma.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
