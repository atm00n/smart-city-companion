import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Calendar, Bus, Ticket, Compass, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage, useTranslations } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', icon: Home, labelKey: 'home' },
  { path: '/map', icon: Map, labelKey: 'map' },
  { path: '/itinerary', icon: Calendar, labelKey: 'itinerary' },
  { path: '/mobility', icon: Bus, labelKey: 'mobility' },
  { path: '/tickets', icon: Ticket, labelKey: 'tickets' },
  { path: '/recommendations', icon: Compass, labelKey: 'recommendations' },
] as const;

export function BottomNav() {
  const location = useLocation();
  const t = useTranslations();
  const { language, setLanguage } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-between px-2 py-2 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, labelKey }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[52px]',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'animate-float')} />
              <span className="text-[10px] font-medium truncate">
                {t[labelKey as keyof typeof t]}
              </span>
            </Link>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 h-auto min-w-[52px]"
        >
          <Globe className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase">{language}</span>
        </Button>
      </div>
    </nav>
  );
}
