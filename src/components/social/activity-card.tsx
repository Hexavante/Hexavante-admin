"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Heart, MessageCircle, Pin } from "lucide-react";
import { toggleLikeAction } from "@/app/actions/social";
import { ActivityComments } from "@/components/social/activity-comments";
import { ActivityPostMenu } from "@/components/social/activity-post-menu";
import { ActivityReactions } from "@/components/social/activity-reactions";
import { Avatar } from "@/components/ui/avatar";
import { ClientOnly } from "@/components/ui/client-only";
import { useToast } from "@/components/ui/toast";
import type { FeedActivity } from "@/lib/social";
import { formatEventText, timeAgo } from "@/lib/social";
import { cn } from "@/lib/cn";

type Props = {
  activity: FeedActivity;
  canInteract?: boolean;
  canModerate?: boolean;
  viewerId?: string;
  highlight?: boolean;
};

export function ActivityCard({
  activity,
  canInteract = false,
  canModerate = false,
  viewerId,
  highlight = false,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [liked, setLiked] = useState(activity.likedByViewer);
  const [likes, setLikes] = useState(activity.likes);
  const { toast } = useToast();

  const username = activity.user?.username ?? "usuario";
  const fullName = activity.user?.fullName ?? username;
  const avatarUrl = activity.user?.avatarUrl ?? null;
  const isDiscussion = activity.type === "DISCUSSION";
  const canAcceptSolution = Boolean(viewerId && viewerId === activity.user.id);
  const isOwnPost = Boolean(viewerId && viewerId === activity.user.id);

  return (
    <article
      id={`post-${activity.id}`}
      className={cn(
        "flex gap-3 rounded-xl border bg-[var(--surface)] p-3 sm:p-4",
        highlight
          ? "border-[hsl(var(--sidebar-highlight)/0.4)] ring-1 ring-[hsl(var(--sidebar-highlight)/0.18)]"
          : activity.isPinned
            ? "border-amber-400/25 ring-1 ring-amber-400/10"
            : "border-[hsl(var(--sidebar-border))]",
      )}
    >
      <Link href={`/perfil/${username}`} className="shrink-0">
        <Avatar src={avatarUrl} alt={username} size="sm" />
      </Link>

      <div className="min-w-0 flex-1">
        {activity.isPinned && (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
            <Pin className="h-3.5 w-3.5" />
            Fixado
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/perfil/${username}`}
              className="font-semibold transition hover:underline hx-text-title hx-accent-link"
            >
              {fullName}
            </Link>
            <span className="text-sm text-slate-500">@{username}</span>
            <span className="text-sm text-slate-500">· {timeAgo(activity.createdAt)}</span>
          </div>

          {canInteract && (
            <ClientOnly>
              <ActivityPostMenu
                activityId={activity.id}
                activityType={activity.type}
                isPinned={activity.isPinned}
                canModerate={canModerate}
                isOwnPost={isOwnPost}
              />
            </ClientOnly>
          )}
        </div>

        {isDiscussion ? (
          <div className="mt-2">
            <h3 className="text-base font-semibold hx-text-title">
              {activity.metadata.title ?? "Publicação"}
            </h3>
            {activity.metadata.body && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 hx-text-muted">
                {activity.metadata.body}
              </p>
            )}
            {activity.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[hsl(var(--sidebar-highlight)/0.12)] px-2.5 py-1 text-xs font-medium hx-accent-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-1 text-sm leading-6 text-slate-300">
            {formatEventText(activity.type, activity.metadata)}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <ActivityReactions
            activityId={activity.id}
            counts={activity.reactions}
            viewerReactions={activity.viewerReactions}
            canInteract={canInteract}
          />

          <button
            type="button"
            disabled={!canInteract || pending}
            onClick={() => {
              if (!canInteract) return;
              startTransition(async () => {
                const result = await toggleLikeAction(activity.id);
                if (result.success && result.liked !== undefined) {
                  setLiked(result.liked);
                  setLikes((count) => Math.max(0, count + (result.liked ? 1 : -1)));
                } else if (result.error) {
                  toast(result.error, "error");
                }
              });
            }}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition",
              liked
                ? "bg-rose-400/15 text-rose-200"
                : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200",
              !canInteract && "cursor-default opacity-70",
            )}
            aria-label={liked ? "Descurtir" : "Curtir"}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            <span>{likes}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <MessageCircle className="h-4 w-4" />
            {activity.comments}
          </span>
        </div>

        {(isDiscussion || activity.comments > 0) && (
          <ActivityComments
            activityId={activity.id}
            initialCount={activity.comments}
            canInteract={canInteract}
            canAcceptSolution={canAcceptSolution}
            open={highlight}
          />
        )}
      </div>
    </article>
  );
}
