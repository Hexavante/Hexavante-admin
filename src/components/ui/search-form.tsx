import { Button } from "@/components/ui/button";

type Props = {
  placeholder: string;
  defaultValue?: string;
  /** Parâmetros extras preservados na busca (ex.: status). */
  hidden?: Record<string, string>;
};

/** Busca GET server-side: submete para a própria página com ?q=. */
export function SearchForm({ placeholder, defaultValue, hidden }: Props) {
  return (
    <form method="GET" className="flex w-full items-center gap-2 sm:w-96">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none"
      />
      {hidden &&
        Object.entries(hidden).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
      <Button type="submit" variant="outline" size="sm">
        Buscar
      </Button>
    </form>
  );
}
