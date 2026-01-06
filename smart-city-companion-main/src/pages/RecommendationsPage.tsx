import { motion } from 'framer-motion';
import { Compass, Castle, UtensilsCrossed, Gem } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations, useLanguage } from '@/hooks/useLanguage';
import { useCuratedLists, useCuratedListItems } from '@/hooks/useAttractions';
import { AttractionCard } from '@/components/AttractionCard';
import { AttractionDetailDialog } from '@/components/AttractionDetailDialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Attraction } from '@/types/tourism';

const icons: Record<string, any> = { castle: Castle, utensils: UtensilsCrossed, gem: Gem };

export default function RecommendationsPage() {
  const t = useTranslations();
  const { t: translate } = useLanguage();
  const { data: lists } = useCuratedLists();
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const { data: listItems, isLoading } = useCuratedListItems(selectedList);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          {t.recommendations}
        </h1>
      </motion.div>

      {/* Curated Lists */}
      <div className="grid grid-cols-1 gap-3">
        {lists?.map((list) => {
          const Icon = icons[list.icon] || Gem;
          const isSelected = selectedList === list.id;
          return (
            <motion.div key={list.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card
                className={cn(
                  'glass-card cursor-pointer transition-all',
                  isSelected && 'border-primary glow-primary'
                )}
                onClick={() => setSelectedList(isSelected ? null : list.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{translate(list.title, list.title_es)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {translate(list.description || '', list.description_es)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* List Items */}
      {selectedList && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {isLoading ? (
            <p className="text-center text-muted-foreground">{t.loading}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {listItems?.map((attraction) => (
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
      )}

      <AttractionDetailDialog
        attraction={selectedAttraction}
        open={!!selectedAttraction}
        onOpenChange={(open) => !open && setSelectedAttraction(null)}
      />
    </div>
  );
}
