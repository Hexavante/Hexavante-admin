// Componente de transição de página
// Adiciona animações suaves ao navegar entre páginas
interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="w-full min-w-0">{children}</div>
  );
}
