import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Attraction } from '@/types/tourism';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface AttractionCardProps {
  attraction: Attraction;
  onClick?: () => void;
  compact?: boolean;
}

const categoryColors: Record<string, string> = {
  heritage: 'category-heritage',
  nature: 'category-nature',
  food: 'category-food',
  shopping: 'category-shopping',
  entertainment: 'category-entertainment',
  religious: 'category-religious',
  museum: 'category-museum',
};

export function AttractionCard({ attraction, onClick, compact }: AttractionCardProps) {
  const { t } = useLanguage();
  const name = t(attraction.name, attraction.name_es);
  const description = t(attraction.description, attraction.description_es);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card
        className={cn(
          'overflow-hidden cursor-pointer glass-card group transition-all duration-500',
          'hover:shadow-2xl hover:shadow-primary/10',
          compact ? 'h-full' : ''
        )}
        onClick={onClick}
      >
        <div className="relative overflow-hidden">
          <div
            className={cn(
              'bg-gradient-to-br from-secondary to-muted transition-transform duration-500 group-hover:scale-110',
              compact ? 'h-32' : 'h-44'
            )}
          >
            {attraction.image_url ? (
              <img
                src={attraction.image_url}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-60" />
          </div>
          <Badge
            className={cn(
              'absolute top-3 right-3 border backdrop-blur-md text-[10px] font-semibold uppercase tracking-wide',
              categoryColors[attraction.category]
            )}
            variant="outline"
          >
            {attraction.category}
          </Badge>
        </div>

        <CardContent className={cn('p-4 relative', compact && 'p-3')}>
          <h3 className={cn(
            'font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300', 
            compact ? 'text-sm' : 'text-base'
          )}>
            {name}
          </h3>

          {!compact && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-bold text-yellow-500">{attraction.rating}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {attraction.opening_hours && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50">
                  <Clock className="h-3 w-3" />
                  <span className="truncate max-w-[70px] text-[10px]">{attraction.opening_hours}</span>
                </div>
              )}
            </div>
          </div>

          {!compact && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm">
                {attraction.ticket_price > 0 ? `₹${attraction.ticket_price}` : 'Free Entry'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
