import { PageTransition } from "@/components/ui/page-transition";
import { BackgroundMusic } from "@/components/landing/background-music";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-w-0">
      <PageTransition>{children}</PageTransition>
      <BackgroundMusic />
    </div>
  );
}
