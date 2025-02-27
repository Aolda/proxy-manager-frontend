import { Link } from 'react-router';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex bg-background sticky top-0 z-50 w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <MenuIcon />
        </Button>
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <span className="whitespace-nowrap">Aolda Cloud</span>
        </Link>
      </div>
    </header>
  );
}
