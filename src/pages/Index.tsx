import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, MessageCircle, ChevronRight, Sparkles, User, LogOut, Zap } from 'lucide-react';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

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
    <motion.div 
      className="space-y-8 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative Orbs */}
      <div className="orb orb-primary w-64 h-64 -top-20 -left-32 fixed" />
      <div className="orb orb-accent w-48 h-48 top-40 -right-24 fixed animation-delay-200" />
      
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="pt-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Zap className="h-3 w-3" />
              <span>AI-Powered Travel</span>
            </motion.div>
            <h1 className="text-4xl font-bold font-display gradient-text-animated leading-tight">
              {t.welcome}
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs">{t.tagline}</p>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-secondary/50 backdrop-blur-sm border border-white/5 hover:bg-secondary"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-xl border-white/10">
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/auth')}
              className="rounded-full bg-secondary/50 backdrop-blur-sm border border-white/5"
            >
              Sign In
            </Button>
          )}
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div variants={itemVariants}>
        <WeatherWidget />
      </motion.div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <motion.div variants={itemVariants}>
          <AlertBanner alerts={alerts} />
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <Link to="/itinerary" className="group">
          <Card className="glass-card card-hover h-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-5 flex flex-col items-center text-center relative">
              <div className="icon-container mb-3 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-semibold">{t.planTrip}</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/map" className="group">
          <Card className="glass-card card-hover h-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-5 flex flex-col items-center text-center relative">
              <div className="icon-container mb-3 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <span className="text-xs font-semibold">{t.exploreMap}</span>
            </CardContent>
          </Card>
        </Link>

        <Card 
          className="glass-card card-hover cursor-pointer overflow-hidden relative group"
          onClick={() => openChat(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-info/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-5 flex flex-col items-center text-center relative">
            <div className="icon-container mb-3 group-hover:scale-110 transition-transform duration-300 pulse-ring">
              <MessageCircle className="h-6 w-6 text-info" />
            </div>
            <span className="text-xs font-semibold">{t.chatWithAI}</span>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Attractions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{t.featuredAttractions}</h2>
              <p className="text-xs text-muted-foreground">Top rated places</p>
            </div>
          </div>
          <Link to="/map">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs rounded-full hover:bg-primary/10 hover:text-primary"
            >
              {t.viewAll}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-48 animate-pulse bg-secondary/50 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {featuredAttractions?.slice(0, 4).map((attraction, index) => (
              <motion.div
                key={attraction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AttractionCard 
                  attraction={attraction} 
                  compact 
                  onClick={() => setSelectedAttraction(attraction)}
                />
              </motion.div>
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
    </motion.div>
  );
}