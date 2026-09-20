import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { cn } from "@/lib/cn";

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  current: {
    category?: string;
    q?: string;
    sort?: string;
  };
};

function buildHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `/tutorials?${qs}` : "/tutorials";
}

export function TutorialFilters({ categories, current }: Props) {
  return (
    <Card padding="md" className="mb-6 space-y-4">
      <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="q" className="mb-1.5 block text-sm font-semibold text-slate-200">
            Buscar
          </label>
          <Input
            id="q"
            name="q"
            defaultValue={current.q ?? ""}
            placeholder="Nome ou descrição do tutorial..."
          />
        </div>
        <div className="w-full sm:w-44">
          <label htmlFor="sort" className="mb-1.5 block text-sm font-semibold text-slate-200">
            Ordenar
          </label>
          <NativeSelect id="sort" name="sort" defaultValue={current.sort ?? "recent"}>
            <option value="recent">Mais recentes</option>
            <option value="popular">Mais vistos</option>
          </NativeSelect>
        </div>
        {current.category && <input type="hidden" name="category" value={current.category} />}
        <Button type="submit" className="sm:mb-0">
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </form>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ q: current.q, sort: current.sort })}
            className={cn(
              "hx-filter-pill",
              !current.category ? "hx-filter-pill-active" : "hx-filter-pill-inactive",
            )}
          >
            Todas categorias
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildHref({ category: cat.id, q: current.q, sort: current.sort })}
              className={cn(
                "hx-filter-pill",
                current.category === cat.id ? "hx-filter-pill-active" : "hx-filter-pill-inactive",
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
