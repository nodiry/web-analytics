import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BarChart3, LayoutDashboard, User, LogOut, Menu } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ModeToggle } from './mode-toggle';
import LangOption from './LangOption';
import { useTranslation } from '@/i18n';
import { authApi } from '@/api/auth';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  const initials = user
    ? `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'
    : 'U';

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 h-14 z-50 border-b border-border/60 backdrop-blur-md bg-background/80">
      <div className="max-w-screen-xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Left — logo + nav */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm tracking-tight hidden sm:inline">Glasscube</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                {t('dashboard')}
              </Link>
            </Button>
          </nav>
        </div>

        {/* Right — desktop controls */}
        <div className="hidden md:flex items-center gap-2">
          <LangOption />
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                  {initials}
                </div>
                {user?.username && <span className="max-w-[80px] truncate text-xs">{user.username}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" /> {t('profile')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> {t('signout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Glasscube
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-2">
              <Button variant="ghost" className="justify-start" asChild onClick={() => setMenuOpen(false)}>
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> {t('dashboard')}
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild onClick={() => setMenuOpen(false)}>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" /> {t('profile')}
                </Link>
              </Button>
            </div>
            <div className="absolute bottom-6 left-4 right-4 flex items-center gap-2">
              <LangOption />
              <ModeToggle />
              <Button variant="destructive" size="sm" className="ml-auto" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> {t('signout')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
