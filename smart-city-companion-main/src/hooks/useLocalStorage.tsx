import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Itinerary, SavedTicket, ItineraryItem, Attraction } from '@/types/tourism';

interface LocalStorageStore {
  // Itineraries
  itineraries: Itinerary[];
  addItinerary: (itinerary: Itinerary) => void;
  updateItinerary: (id: string, items: ItineraryItem[]) => void;
  deleteItinerary: (id: string) => void;
  
  // Current itinerary being built
  currentItinerary: ItineraryItem[];
  addToCurrentItinerary: (attraction: Attraction, time: string, duration: number) => void;
  removeFromCurrentItinerary: (itemId: string) => void;
  clearCurrentItinerary: () => void;
  
  // Tickets
  tickets: SavedTicket[];
  addTicket: (ticket: SavedTicket) => void;
  removeTicket: (id: string) => void;
  
  // Favorites
  favorites: string[]; // attraction IDs
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useLocalStorage = create<LocalStorageStore>()(
  persist(
    (set, get) => ({
      // Itineraries
      itineraries: [],
      addItinerary: (itinerary) =>
        set((state) => ({ itineraries: [...state.itineraries, itinerary] })),
      updateItinerary: (id, items) =>
        set((state) => ({
          itineraries: state.itineraries.map((it) =>
            it.id === id ? { ...it, items } : it
          ),
        })),
      deleteItinerary: (id) =>
        set((state) => ({
          itineraries: state.itineraries.filter((it) => it.id !== id),
        })),
      
      // Current itinerary
      currentItinerary: [],
      addToCurrentItinerary: (attraction, time, duration) =>
        set((state) => ({
          currentItinerary: [
            ...state.currentItinerary,
            {
              id: crypto.randomUUID(),
              attraction,
              time,
              duration,
            },
          ],
        })),
      removeFromCurrentItinerary: (itemId) =>
        set((state) => ({
          currentItinerary: state.currentItinerary.filter((item) => item.id !== itemId),
        })),
      clearCurrentItinerary: () => set({ currentItinerary: [] }),
      
      // Tickets
      tickets: [],
      addTicket: (ticket) =>
        set((state) => ({ tickets: [...state.tickets, ticket] })),
      removeTicket: (id) =>
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
        })),
      
      // Favorites
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
    }),
    {
      name: 'pune-tourism-storage',
    }
  )
);
