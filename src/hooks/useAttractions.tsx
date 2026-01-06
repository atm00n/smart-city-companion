import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Attraction, Alert, CuratedList, Event } from '@/types/tourism';

export function useAttractions() {
  return useQuery({
    queryKey: ['attractions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as Attraction[];
    },
  });
}

export function useFeaturedAttractions() {
  return useQuery({
    queryKey: ['attractions', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .eq('is_featured', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as Attraction[];
    },
  });
}

export function useAttractionsByCategory(category: string | null) {
  return useQuery({
    queryKey: ['attractions', 'category', category],
    queryFn: async () => {
      let query = supabase.from('attractions').select('*');

      if (category && category !== 'all') {
        query = query.eq('category', category as any);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) throw error;
      return data as Attraction[];
    },
    enabled: true,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });
}

export function useCuratedLists() {
  return useQuery({
    queryKey: ['curated_lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('curated_lists')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as CuratedList[];
    },
  });
}

export function useCuratedListItems(listId: string | null) {
  return useQuery({
    queryKey: ['curated_list_items', listId],
    queryFn: async () => {
      if (!listId) return [];

      const { data, error } = await supabase
        .from('curated_list_items')
        .select(`
          id,
          sort_order,
          attractions (*)
        `)
        .eq('list_id', listId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data.map((item: any) => item.attractions) as Attraction[];
    },
    enabled: !!listId,
  });
}
