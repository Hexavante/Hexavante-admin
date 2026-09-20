"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Video, GraduationCap, ClipboardCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { APP_URL } from "@/lib/app-url";

type UserHit = {
  id: string;
  username: string | null;
  fullName: string;
  avatarUrl: string | null;
  level: number;
  isBanned: boolean;
  isMuted: boolean;
};

type ContentHit = {
  id: string;
  title: string;
  slug: string;
  type: "tutorial" | "course" | "exam";
  status: string;
};

type SpotlightResult = {
  users: UserHit[];
  tutorials: ContentHit[];
  courses: ContentHit[];
  exams: ContentHit[];
};

export function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserHit[]>([]);
  const [tutorials, setTutorials] = useState<ContentHit[]>([]);
  const [courses, setCourses] = useState<ContentHit[]>([]);
  const [exams, setExams] = useState<ContentHit[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setUsers([]);
      setTutorials([]);
      setCourses([]);
      setExams([]);
      return;
    }
    const res = await fetch(`/api/moderation/spotlight?q=${encodeURIComponent(q)}`);
    const data = (await res.json()) as SpotlightResult;
    setUsers(data.users ?? []);
    setTutorials(data.tutorials ?? []);
    setCourses(data.courses ?? []);
    setExams(data.exams ?? []);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void search(query), 250);
    return () => clearTimeout(t);
  }, [query, search]);

  if (!open) return null;

  const totalResults = users.length + tutorials.length + courses.length + exams.length;

  return (
    <div className="fixed inset-0 z-[10004] flex items-start justify-center bg-black/60 p-4 pt-[15vh]">
      <div className="hx-dark-surface w-full max-w-lg rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-[#1e1e2e] px-4 py-3">
          <Search className="h-4 w-4 text-slate-500" />
          <Input
            autoFocus
            placeholder="Buscar usuários, tutoriais, cursos, simulados..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent shadow-none focus:ring-0"
          />
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-500">
            Esc
          </button>
        </div>
        <ul className="max-h-96 overflow-y-auto p-2">
          {/* Users */}
          {users.length > 0 && (
            <li className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Usuários
            </li>
          )}
          {users.map((user) => (
            <li key={`u-${user.id}`}>
              <Link
                href={`${APP_URL}/perfil/${user.username}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/[0.06]"
              >
                <Avatar src={user.avatarUrl} alt={user.username ?? ""} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{user.fullName}</p>
                  <p className="text-sm text-slate-400">
                    @{user.username} · Nível {user.level}
                  </p>
                </div>
                {user.isBanned && <span className="text-xs text-red-400">Banido</span>}
                {user.isMuted && !user.isBanned && (
                  <span className="text-xs text-amber-400">Mute</span>
                )}
              </Link>
            </li>
          ))}

          {/* Tutorials */}
          {tutorials.length > 0 && (
            <li className="mt-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tutoriais
            </li>
          )}
          {tutorials.map((t) => (
            <li key={`t-${t.id}`}>
              <Link
                href={`/tutorials/${t.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/[0.06]"
              >
                <Video className="h-4 w-4 text-violet-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{t.title}</p>
                  <p className="text-sm text-slate-400">
                    {t.status === "published" ? "Publicado" : "Rascunho"}
                  </p>
                </div>
                <Link
                  href={`/admin/tutorials`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Mod
                </Link>
              </Link>
            </li>
          ))}

          {/* Courses */}
          {courses.length > 0 && (
            <li className="mt-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cursos
            </li>
          )}
          {courses.map((c) => (
            <li key={`c-${c.id}`}>
              <Link
                href={`/admin/cursos/${c.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/[0.06]"
              >
                <GraduationCap className="h-4 w-4 text-sky-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{c.title}</p>
                  <p className="text-sm text-slate-400">{c.status}</p>
                </div>
              </Link>
            </li>
          ))}

          {/* Exams */}
          {exams.length > 0 && (
            <li className="mt-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Simulados
            </li>
          )}
          {exams.map((e) => (
            <li key={`e-${e.id}`}>
              <Link
                href={`/admin/simulados/${e.id}/edit`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/[0.06]"
              >
                <ClipboardCheck className="h-4 w-4 text-teal-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{e.title}</p>
                  <p className="text-sm text-slate-400">
                    {e.status === "published" ? "Publicado" : "Rascunho"}
                  </p>
                </div>
              </Link>
            </li>
          ))}

          {query.length >= 2 && totalResults === 0 && (
            <li className="px-3 py-6 text-center text-sm text-slate-500">Nenhum resultado.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
