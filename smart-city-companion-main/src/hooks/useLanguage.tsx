import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/types/tourism';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, es?: string | null) => string;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      t: (en, es) => {
        const { language } = get();
        if (language === 'es' && es) return es;
        return en;
      },
    }),
    {
      name: 'pune-tourism-language',
    }
  )
);

// Translation dictionary for UI strings
export const translations = {
  en: {
    // Navigation
    home: 'Home',
    map: 'Explore Map',
    itinerary: 'Plan Trip',
    mobility: 'Getting Around',
    tickets: 'Tickets',
    recommendations: 'Discover',
    
    // Home
    welcome: 'Welcome to Pune',
    tagline: 'Discover the cultural capital of Maharashtra',
    planTrip: 'Plan Your Trip',
    exploreMap: 'Explore Map',
    chatWithAI: 'Ask AI',
    featuredAttractions: 'Featured Attractions',
    viewAll: 'View All',
    
    // Itinerary
    generateItinerary: 'Generate Itinerary',
    interests: 'Your Interests',
    duration: 'Trip Duration',
    budget: 'Budget Level',
    days: 'days',
    low: 'Budget-Friendly',
    medium: 'Moderate',
    high: 'Premium',
    savedItineraries: 'Saved Itineraries',
    noItineraries: 'No saved itineraries yet',
    
    // Map
    searchPlaces: 'Search places...',
    allCategories: 'All',
    heritage: 'Heritage',
    nature: 'Nature',
    food: 'Food',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    religious: 'Religious',
    museum: 'Museum',
    
    // Chatbot
    askMe: 'Ask me anything about Pune...',
    thinking: 'Thinking...',
    send: 'Send',
    
    // Tickets
    bookTickets: 'Book Tickets',
    myTickets: 'My Tickets',
    noTickets: 'No tickets yet',
    selectDate: 'Select Visit Date',
    quantity: 'Quantity',
    purchase: 'Purchase',
    free: 'Free Entry',
    
    // Mobility
    metroRoutes: 'Metro Routes',
    busRoutes: 'Bus Routes',
    evCharging: 'EV Charging',
    
    // General
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try Again',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    addToItinerary: 'Add to Itinerary',
    getDirections: 'Get Directions',
    openingHours: 'Opening Hours',
    rating: 'Rating',
    price: 'Price',
  },
  es: {
    // Navigation
    home: 'Inicio',
    map: 'Explorar Mapa',
    itinerary: 'Planificar Viaje',
    mobility: 'Cómo Llegar',
    tickets: 'Entradas',
    recommendations: 'Descubrir',
    
    // Home
    welcome: 'Bienvenido a Pune',
    tagline: 'Descubre la capital cultural de Maharashtra',
    planTrip: 'Planifica tu Viaje',
    exploreMap: 'Explorar Mapa',
    chatWithAI: 'Preguntar IA',
    featuredAttractions: 'Atracciones Destacadas',
    viewAll: 'Ver Todo',
    
    // Itinerary
    generateItinerary: 'Generar Itinerario',
    interests: 'Tus Intereses',
    duration: 'Duración del Viaje',
    budget: 'Nivel de Presupuesto',
    days: 'días',
    low: 'Económico',
    medium: 'Moderado',
    high: 'Premium',
    savedItineraries: 'Itinerarios Guardados',
    noItineraries: 'No hay itinerarios guardados',
    
    // Map
    searchPlaces: 'Buscar lugares...',
    allCategories: 'Todos',
    heritage: 'Patrimonio',
    nature: 'Naturaleza',
    food: 'Comida',
    shopping: 'Compras',
    entertainment: 'Entretenimiento',
    religious: 'Religioso',
    museum: 'Museo',
    
    // Chatbot
    askMe: 'Pregúntame sobre Pune...',
    thinking: 'Pensando...',
    send: 'Enviar',
    
    // Tickets
    bookTickets: 'Reservar Entradas',
    myTickets: 'Mis Entradas',
    noTickets: 'No hay entradas',
    selectDate: 'Seleccionar Fecha',
    quantity: 'Cantidad',
    purchase: 'Comprar',
    free: 'Entrada Gratuita',
    
    // Mobility
    metroRoutes: 'Rutas de Metro',
    busRoutes: 'Rutas de Autobús',
    evCharging: 'Carga EV',
    
    // General
    loading: 'Cargando...',
    error: 'Algo salió mal',
    retry: 'Intentar de Nuevo',
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    addToItinerary: 'Añadir al Itinerario',
    getDirections: 'Obtener Direcciones',
    openingHours: 'Horario',
    rating: 'Calificación',
    price: 'Precio',
  },
} as const;

export const useTranslations = () => {
  const { language } = useLanguage();
  return translations[language];
};
