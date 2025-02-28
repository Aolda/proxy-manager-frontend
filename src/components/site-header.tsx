import { Link, useNavigate } from 'react-router';
import { UserRound, LogOut, MenuIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export function SiteHeader() {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { token, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="flex bg-background sticky top-0 z-50 w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <MenuIcon />
        </Button>
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <span className="whitespace-nowrap">Aolda Cloud</span>
        </Link>
        {token ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto cursor-pointer">
              <Avatar className="w-10 h-10 border">
                <AvatarFallback>{'admin'.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>닉네임</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="w-auto ml-auto" asChild>
            <Link to="/login">
              <UserRound /> 로그인
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
