import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Ticket, Navigation } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Attraction } from '@/types/tourism';
import { useLanguage } from '@/hooks/useLanguage';

interface AttractionDetailDialogProps {
  attraction: Attraction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AttractionDetailDialog({ attraction, open, onOpenChange }: AttractionDetailDialogProps) {
  const { t } = useLanguage();
  
  if (!attraction) return null;

  const name = t(attraction.name, attraction.name_es);
  const description = t(attraction.description, attraction.description_es);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-0">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-secondary to-muted">
          {attraction.image_url ? (
            <img
              src={attraction.image_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          <Badge
            className={`absolute top-3 right-3 ${categoryColors[attraction.category]}`}
            variant="outline"
          >
            {attraction.category}
          </Badge>
        </div>

        <div className="p-4 space-y-4">
          <DialogHeader className="p-0">
            <DialogTitle className="text-xl">{name}</DialogTitle>
            <VisuallyHidden>
              <DialogDescription>Details about {name}</DialogDescription>
            </VisuallyHidden>
          </DialogHeader>

          {/* Rating & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">{attraction.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Ticket className="h-5 w-5" />
              <span className="font-semibold">
                {attraction.ticket_price > 0 ? `₹${attraction.ticket_price}` : 'Free Entry'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Details */}
          <div className="space-y-2">
            {attraction.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <span>{attraction.address}</span>
              </div>
            )}
            {attraction.opening_hours && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{attraction.opening_hours}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <Button className="w-full" asChild>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
