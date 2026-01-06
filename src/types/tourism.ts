export type AttractionCategory = 'heritage' | 'nature' | 'food' | 'shopping' | 'entertainment' | 'religious' | 'museum';

export interface Attraction {
  id: string;
  name: string;
  name_es: string | null;
  description: string;
  description_es: string | null;
  category: AttractionCategory;
  latitude: number;
  longitude: number;
  address: string | null;
  image_url: string | null;
  ticket_price: number;
  opening_hours: string | null;
  rating: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  title: string;
  title_es: string | null;
  message: string;
  message_es: string | null;
  alert_type: 'info' | 'warning' | 'danger';
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  name_es: string | null;
  description: string;
  description_es: string | null;
  location: string | null;
  event_date: string;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface CuratedList {
  id: string;
  title: string;
  title_es: string | null;
  description: string | null;
  description_es: string | null;
  icon: string;
  created_at: string;
}

export interface ItineraryItem {
  id: string;
  attraction: Attraction;
  time: string;
  duration: number; // in minutes
  notes?: string;
}

export interface Itinerary {
  id: string;
  name: string;
  date: string;
  items: ItineraryItem[];
  content?: string; // AI-generated itinerary content
  createdAt: string;
}

export interface SavedTicket {
  id: string;
  attraction: Attraction;
  quantity: number;
  purchaseDate: string;
  visitDate: string;
  confirmationCode: string;
}

export type Language = 'en' | 'es';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
