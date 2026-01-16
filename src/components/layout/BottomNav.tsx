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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="absolute inset-0 bg-card/80 backdrop-blur-2xl border-t border-white/[0.08]" />
      <div className="relative flex items-center justify-between px-2 py-3 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, labelKey }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-[56px] relative group',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20" />
              )}
              <Icon className={cn(
                'h-5 w-5 relative z-10 transition-transform duration-300',
                isActive && 'scale-110',
                !isActive && 'group-hover:scale-110'
              )} />
              <span className="text-[10px] font-semibold relative z-10">
                {t[labelKey as keyof typeof t]}
              </span>
            </Link>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className="flex flex-col items-center gap-1 px-3 py-2 h-auto min-w-[56px] rounded-2xl hover:bg-accent/10 hover:text-accent transition-all duration-300"
        >
          <Globe className="h-5 w-5" />
          <span className="text-[10px] font-semibold uppercase">{language}</span>
        </Button>
      </div>
    </nav>
  );
}
