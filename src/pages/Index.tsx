import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, MessageCircle, ChevronRight, Sparkles, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useLanguage';
import { useFeaturedAttractions, useAlerts } from '@/hooks/useAttractions';
import { AttractionCard } from '@/components/AttractionCard';
import { AlertBanner } from '@/components/AlertBanner';
import { useChatStore } from '@/stores/chatStore';
import { AttractionDetailDialog } from '@/components/AttractionDetailDialog';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Attraction } from '@/types/tourism';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Home() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { data: featuredAttractions, isLoading } = useFeaturedAttractions();
  const { data: alerts } = useAlerts();
  const { setIsOpen: openChat } = useChatStore();
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4"
      >
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold font-display gradient-text">{t.welcome}</h1>
            <p className="text-muted-foreground mt-1">{t.tagline}</p>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-muted-foreground text-xs">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
        </div>
      </motion.div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Alerts */}
      {alerts && alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        <Link to="/itinerary">
          <Card className="glass-card hover:glow-primary transition-all duration-300 h-full">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium">{t.planTrip}</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/map">
          <Card className="glass-card hover:glow-accent transition-all duration-300 h-full">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <span className="text-xs font-medium">{t.exploreMap}</span>
            </CardContent>
          </Card>
        </Link>

        <Card 
          className="glass-card hover:glow-primary transition-all duration-300 cursor-pointer"
          onClick={() => openChat(true)}
        >
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-info/20 flex items-center justify-center mb-2">
              <MessageCircle className="h-6 w-6 text-info" />
            </div>
            <span className="text-xs font-medium">{t.chatWithAI}</span>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Attractions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">{t.featuredAttractions}</h2>
          </div>
          <Link to="/map">
            <Button variant="ghost" size="sm" className="text-xs">
              {t.viewAll}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-44 animate-pulse bg-secondary" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {featuredAttractions?.slice(0, 4).map((attraction) => (
              <AttractionCard 
                key={attraction.id} 
                attraction={attraction} 
                compact 
                onClick={() => setSelectedAttraction(attraction)}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Attraction Detail Dialog */}
      <AttractionDetailDialog
        attraction={selectedAttraction}
        open={!!selectedAttraction}
        onOpenChange={(open) => !open && setSelectedAttraction(null)}
      />
    </div>
  );
}