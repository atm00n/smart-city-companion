import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Loader2, Trash2, Save, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useTranslations } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Itinerary {
  id: string;
  name: string;
  content: string;
  interests: string[];
  duration: number;
  budget: string;
  created_at: string;
}

const interestOptions = ['heritage', 'nature', 'food', 'shopping', 'religious', 'adventure'];
const budgetLevels = ['low', 'medium', 'high'] as const;

export default function ItineraryPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [duration, setDuration] = useState([2]);
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedItinerary, setGeneratedItinerary] = useState<string | null>(null);

  // Fetch user's itineraries
  useEffect(() => {
    if (!user) {
      setItineraries([]);
      setIsLoading(false);
      return;
    }
    
    const fetchItineraries = async () => {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching itineraries:', error);
      } else {
        setItineraries(data || []);
      }
      setIsLoading(false);
    };
    
    fetchItineraries();
  }, [user]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const generateItinerary = async () => {
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    setIsGenerating(true);
    setGeneratedItinerary(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: 'itinerary',
          preferences: {
            interests: selectedInterests,
            duration: duration[0],
            budget,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to generate');

      const data = await response.json();
      setGeneratedItinerary(data.content);
      toast.success('Itinerary generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveItinerary = async () => {
    if (!generatedItinerary || !user) {
      if (!user) {
        toast.error('Please sign in to save itineraries');
      }
      return;
    }

    setIsSaving(true);
    
    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        user_id: user.id,
        name: `${duration[0]}-Day ${selectedInterests.slice(0, 2).join(' & ')} Trip`,
        content: generatedItinerary,
        interests: selectedInterests,
        duration: duration[0],
        budget,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving itinerary:', error);
      toast.error('Failed to save itinerary');
    } else {
      setItineraries((prev) => [data, ...prev]);
      toast.success('Itinerary saved!');
      setGeneratedItinerary(null);
    }
    
    setIsSaving(false);
  };

  const deleteItinerary = async (id: string) => {
    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Failed to delete itinerary');
    } else {
      setItineraries((prev) => prev.filter((i) => i.id !== id));
      toast.success('Itinerary deleted');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          {t.itinerary}
        </h1>
      </motion.div>

      {/* Generator Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t.generateItinerary}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Interests */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t.interests}</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t.duration}: {duration[0]} {t.days}
            </label>
            <Slider value={duration} onValueChange={setDuration} min={1} max={7} step={1} />
          </div>

          {/* Budget */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t.budget}</label>
            <div className="flex gap-2">
              {budgetLevels.map((level) => (
                <Button
                  key={level}
                  variant={budget === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBudget(level)}
                >
                  {t[level]}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={generateItinerary} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {t.generateItinerary}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Itinerary */}
      {generatedItinerary && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Generated Itinerary</span>
                <Button size="sm" onClick={saveItinerary} disabled={isSaving || !user}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {user ? 'Save' : 'Sign in to save'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm font-sans">{generatedItinerary}</pre>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Saved Itineraries */}
      {!isLoading && itineraries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Saved Itineraries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {itineraries.map((itinerary) => (
                <div
                  key={itinerary.id}
                  className="p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{itinerary.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(itinerary.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteItinerary(itinerary.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs font-sans text-muted-foreground line-clamp-4">
                    {itinerary.content}
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
