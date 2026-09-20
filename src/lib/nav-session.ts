export type NavSession = {
  user: {
    id: string;
    username: string | null;
    roles: string[];
    image?: string | null;
    avatarBorderClassName?: string | null;
    badgeLabel?: string | null;
  };
} | null;

export function toNavSession(
  session: {
    user?: {
      id?: string;
      username?: string | null;
      roles?: string[];
      image?: string | null;
    } | null;
  } | null,
  avatarUrl?: string | null,
  extras?: {
    avatarBorderClassName?: string | null;
    badgeLabel?: string | null;
  },
): NavSession {
  if (!session?.user?.id) return null;

  return {
    user: {
      id: session.user.id,
      username: session.user.username ?? null,
      roles: session.user.roles ?? [],
      image: avatarUrl ?? null,
      avatarBorderClassName: extras?.avatarBorderClassName ?? null,
      badgeLabel: extras?.badgeLabel ?? null,
    },
  };
}
