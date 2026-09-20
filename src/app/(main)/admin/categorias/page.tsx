import { listPendingCategories } from "@/services/course.service";
import { requireAdminPage } from "@/lib/admin-page";
import { approveCategoryAction, rejectCategoryAction } from "@/app/actions/category-moderation";
import Link from "next/link";

export default async function ModerateCategoriesPage() {
  await requireAdminPage();
const categories = await listPendingCategories();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/admin"
        className="text-sm text-sky-300 hover:underline"
        aria-label="Voltar para moderação"
      >
        ← Moderação
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">Categorias pendentes</h1>
      <p className="mt-2 text-sm text-slate-400">
        Categorias sugeridas por instrutores aguardando aprovação.
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 text-slate-400">Nenhuma categoria pendente.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div>
                <p className="font-semibold text-white">{cat.name}</p>
                {cat.description && (
                  <p className="mt-1 text-sm text-slate-400">{cat.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <form action={approveCategoryAction.bind(null, cat.id)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-300 hover:bg-emerald-400/20"
                  >
                    Aprovar
                  </button>
                </form>
                <form action={rejectCategoryAction.bind(null, cat.id)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-sm font-medium text-red-300 hover:bg-red-400/20"
                  >
                    Rejeitar
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
