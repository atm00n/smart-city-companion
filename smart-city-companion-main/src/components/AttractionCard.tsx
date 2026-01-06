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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card
        className={cn(
          'overflow-hidden cursor-pointer bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300',
          compact ? 'h-full' : ''
        )}
        onClick={onClick}
      >
        <div className="relative">
          <div
            className={cn(
              'bg-gradient-to-br from-secondary to-muted',
              compact ? 'h-28' : 'h-40'
            )}
          >
            {attraction.image_url ? (
              <img
                src={attraction.image_url}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
          <Badge
            className={cn(
              'absolute top-2 right-2 border',
              categoryColors[attraction.category]
            )}
            variant="outline"
          >
            {attraction.category}
          </Badge>
        </div>

        <CardContent className={cn('p-3', compact && 'p-2.5')}>
          <h3 className={cn('font-semibold line-clamp-1', compact ? 'text-sm' : 'text-base')}>
            {name}
          </h3>

          {!compact && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-medium">{attraction.rating}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {attraction.opening_hours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="truncate max-w-[80px]">{attraction.opening_hours}</span>
                </div>
              )}
            </div>
          </div>

          {!compact && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              <Ticket className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">
                {attraction.ticket_price > 0 ? `₹${attraction.ticket_price}` : 'Free Entry'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
