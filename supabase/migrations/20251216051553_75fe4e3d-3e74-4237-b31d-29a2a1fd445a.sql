-- Create enum for attraction categories
CREATE TYPE public.attraction_category AS ENUM ('heritage', 'nature', 'food', 'shopping', 'entertainment', 'religious', 'museum');

-- Create attractions table for POIs
CREATE TABLE public.attractions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_es TEXT, -- Spanish translation
    description TEXT NOT NULL,
    description_es TEXT, -- Spanish translation
    category attraction_category NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    image_url TEXT,
    ticket_price DECIMAL(10, 2) DEFAULT 0,
    opening_hours TEXT,
    rating DECIMAL(2, 1) DEFAULT 4.0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table for safety/traffic/event notifications
CREATE TABLE public.alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    title_es TEXT,
    message TEXT NOT NULL,
    message_es TEXT,
    alert_type TEXT NOT NULL DEFAULT 'info', -- info, warning, danger
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_es TEXT,
    description TEXT NOT NULL,
    description_es TEXT,
    location TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create curated lists table for recommendations
CREATE TABLE public.curated_lists (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    title_es TEXT,
    description TEXT,
    description_es TEXT,
    icon TEXT DEFAULT 'star',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for curated list items
CREATE TABLE public.curated_list_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    list_id UUID REFERENCES public.curated_lists(id) ON DELETE CASCADE NOT NULL,
    attraction_id UUID REFERENCES public.attractions(id) ON DELETE CASCADE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    UNIQUE(list_id, attraction_id)
);

-- Enable RLS on all tables (public read for attractions/events/alerts, admin write via edge functions)
ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_list_items ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view attractions, alerts, events)
CREATE POLICY "Anyone can view attractions" ON public.attractions FOR SELECT USING (true);
CREATE POLICY "Anyone can view active alerts" ON public.alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can view curated lists" ON public.curated_lists FOR SELECT USING (true);
CREATE POLICY "Anyone can view curated list items" ON public.curated_list_items FOR SELECT USING (true);

-- For admin operations, we'll use service role in edge functions (no auth needed per requirements)
-- Allow inserts/updates/deletes for service role (handled by edge functions)
CREATE POLICY "Service role can manage attractions" ON public.attractions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage curated lists" ON public.curated_lists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage curated list items" ON public.curated_list_items FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to attractions
CREATE TRIGGER update_attractions_updated_at
    BEFORE UPDATE ON public.attractions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for Pune attractions
INSERT INTO public.attractions (name, name_es, description, description_es, category, latitude, longitude, address, ticket_price, opening_hours, rating, is_featured) VALUES
('Shaniwar Wada', 'Shaniwar Wada', 'Historic fortification and seat of the Peshwa rulers of the Maratha Empire', 'Fortificación histórica y sede de los gobernantes Peshwa del Imperio Maratha', 'heritage', 18.5195, 73.8553, 'Shaniwar Peth, Pune', 25, '8:00 AM - 6:30 PM', 4.5, true),
('Aga Khan Palace', 'Palacio Aga Khan', 'Historical landmark where Mahatma Gandhi was imprisoned', 'Hito histórico donde Mahatma Gandhi fue encarcelado', 'heritage', 18.5525, 73.9015, 'Nagar Road, Pune', 50, '9:00 AM - 5:30 PM', 4.6, true),
('Sinhagad Fort', 'Fuerte Sinhagad', 'Ancient hill fortress with panoramic views and rich history', 'Antigua fortaleza de montaña con vistas panorámicas e historia rica', 'heritage', 18.3661, 73.7558, 'Sinhagad, Pune', 0, '6:00 AM - 6:00 PM', 4.7, true),
('Dagdusheth Halwai Ganpati', 'Templo Dagdusheth Ganpati', 'Famous Ganesh temple visited by millions every year', 'Famoso templo de Ganesh visitado por millones cada año', 'religious', 18.5165, 73.8560, 'Budhwar Peth, Pune', 0, '6:00 AM - 10:30 PM', 4.8, true),
('Pataleshwar Cave Temple', 'Templo de la Cueva Pataleshwar', '8th century rock-cut cave temple dedicated to Lord Shiva', 'Templo cueva tallado en roca del siglo VIII dedicado al Señor Shiva', 'heritage', 18.5230, 73.8445, 'Jungli Maharaj Road, Pune', 0, '8:00 AM - 5:30 PM', 4.3, false),
('Okayama Friendship Garden', 'Jardín de la Amistad Okayama', 'Japanese garden symbolizing friendship between Pune and Okayama', 'Jardín japonés que simboliza la amistad entre Pune y Okayama', 'nature', 18.5307, 73.8412, 'Sinhagad Road, Pune', 10, '9:30 AM - 6:00 PM', 4.2, false),
('Raja Dinkar Kelkar Museum', 'Museo Raja Dinkar Kelkar', 'Museum with over 20,000 artifacts of Indian heritage', 'Museo con más de 20,000 artefactos del patrimonio indio', 'museum', 18.5153, 73.8567, 'Bajirao Road, Pune', 100, '9:30 AM - 5:30 PM', 4.4, false),
('FC Road', 'FC Road', 'Popular street for shopping, cafes and street food', 'Calle popular para compras, cafés y comida callejera', 'shopping', 18.5236, 73.8420, 'Fergusson College Road, Pune', 0, 'Open 24 hours', 4.1, false),
('Koregaon Park', 'Parque Koregaon', 'Upscale area with trendy cafes, restaurants and nightlife', 'Zona exclusiva con cafés de moda, restaurantes y vida nocturna', 'entertainment', 18.5362, 73.8940, 'Koregaon Park, Pune', 0, 'Open 24 hours', 4.3, false),
('Vetal Tekdi', 'Vetal Tekdi', 'Popular hill for hiking with beautiful sunrise views', 'Colina popular para senderismo con hermosas vistas del amanecer', 'nature', 18.5116, 73.8136, 'Paud Road, Pune', 0, '5:00 AM - 10:00 AM', 4.5, false);

-- Insert seed data for curated lists
INSERT INTO public.curated_lists (title, title_es, description, description_es, icon) VALUES
('Top Heritage Sites', 'Principales Sitios Patrimoniales', 'Explore Pune''s rich historical landmarks', 'Explora los ricos hitos históricos de Pune', 'castle'),
('Best Street Food', 'Mejor Comida Callejera', 'Discover authentic Pune flavors', 'Descubre los auténticos sabores de Pune', 'utensils'),
('Hidden Gems', 'Joyas Ocultas', 'Lesser-known but amazing spots', 'Lugares menos conocidos pero increíbles', 'gem');

-- Link attractions to curated lists
INSERT INTO public.curated_list_items (list_id, attraction_id, sort_order)
SELECT cl.id, a.id, ROW_NUMBER() OVER (PARTITION BY cl.id ORDER BY a.rating DESC)
FROM public.curated_lists cl
CROSS JOIN public.attractions a
WHERE 
    (cl.title = 'Top Heritage Sites' AND a.category = 'heritage')
    OR (cl.title = 'Best Street Food' AND a.category IN ('food', 'shopping'))
    OR (cl.title = 'Hidden Gems' AND a.is_featured = false);

-- Insert sample alerts
INSERT INTO public.alerts (title, title_es, message, message_es, alert_type, is_active) VALUES
('Welcome to Pune!', '¡Bienvenido a Pune!', 'Enjoy exploring the cultural capital of Maharashtra', 'Disfruta explorando la capital cultural de Maharashtra', 'info', true),
('Metro Service Update', 'Actualización del Servicio de Metro', 'Purple Line now operational from PCMC to Swargate', 'Línea Púrpura ahora operativa desde PCMC hasta Swargate', 'info', true);