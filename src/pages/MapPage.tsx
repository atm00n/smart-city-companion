import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAttractionsByCategory } from '@/hooks/useAttractions';
import { useTranslations, useLanguage } from '@/hooks/useLanguage';
import { AttractionCategory } from '@/types/tourism';

const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 };

const categories: (AttractionCategory | 'all')[] = ['all', 'heritage', 'nature', 'food', 'shopping', 'entertainment', 'religious', 'museum'];

export default function MapPage() {
  const t = useTranslations();
  const { t: translate } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [search, setSearch] = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const { data: attractions, isLoading } = useAttractionsByCategory(selectedCategory);
  const mapRef = useRef<HTMLIFrameElement>(null);

  const filteredAttractions = attractions?.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  const getMapUrl = (lat: number, lng: number, zoom: number = 13) => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05}%2C${lat - 0.03}%2C${lng + 0.05}%2C${lat + 0.03}&layer=mapnik&marker=${lat}%2C${lng}`;
  };

  const currentLocation = selectedAttraction 
    ? filteredAttractions?.find(a => a.id === selectedAttraction) 
    : null;

  const mapUrl = currentLocation 
    ? getMapUrl(Number(currentLocation.latitude), Number(currentLocation.longitude), 16)
    : getMapUrl(PUNE_CENTER.lat, PUNE_CENTER.lng);

  return (
    <div className="space-y-4 -mx-4 -mt-4">
      {/* Search and filters */}
      <div className="px-4 pt-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaces}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-0"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="flex-shrink-0 text-xs"
            >
              {cat === 'all' ? t.allCategories : t[cat as keyof typeof t] || cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="h-[40vh] relative bg-secondary">
        <iframe
          ref={mapRef}
          src={mapUrl}
          className="w-full h-full border-0"
          title="Pune Map"
          loading="lazy"
        />
      </div>

      {/* Attractions List */}
      <div className="px-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          {isLoading ? t.loading : `${filteredAttractions?.length || 0} places found`}
        </p>
        
        <div className="space-y-2 max-h-[30vh] overflow-y-auto">
          {filteredAttractions?.map((attraction) => (
            <Card 
              key={attraction.id}
              className={`p-3 cursor-pointer transition-colors ${
                selectedAttraction === attraction.id 
                  ? 'bg-primary/20 border-primary' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
              onClick={() => setSelectedAttraction(
                selectedAttraction === attraction.id ? null : attraction.id
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {translate(attraction.name, attraction.name_es)}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {translate(attraction.description, attraction.description_es)}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {attraction.category}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
