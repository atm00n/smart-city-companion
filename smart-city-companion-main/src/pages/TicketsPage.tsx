import { motion } from 'framer-motion';
import { Ticket, QrCode, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations, useLanguage } from '@/hooks/useLanguage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAttractions } from '@/hooks/useAttractions';
import { toast } from 'sonner';

export default function TicketsPage() {
  const t = useTranslations();
  const { t: translate } = useLanguage();
  const { tickets, addTicket } = useLocalStorage();
  const { data: attractions } = useAttractions();

  const ticketableAttractions = attractions?.filter((a) => a.ticket_price > 0);

  const handlePurchase = (attraction: any) => {
    const ticket = {
      id: crypto.randomUUID(),
      attraction,
      quantity: 1,
      purchaseDate: new Date().toISOString(),
      visitDate: new Date(Date.now() + 86400000).toISOString(),
      confirmationCode: `PNE${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    addTicket(ticket);
    toast.success('Ticket purchased!', { description: `Confirmation: ${ticket.confirmationCode}` });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          {t.tickets}
        </h1>
      </motion.div>

      {/* My Tickets */}
      {tickets.length > 0 && (
        <Card className="glass-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-base">{t.myTickets}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{translate(ticket.attraction.name, ticket.attraction.name_es)}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(ticket.visitDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">{ticket.confirmationCode}</Badge>
                </div>
                <div className="mt-3 flex justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Available Tickets */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">{t.bookTickets}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ticketableAttractions?.map((attraction) => (
            <div key={attraction.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-sm">{translate(attraction.name, attraction.name_es)}</p>
                <p className="text-xs text-muted-foreground">{attraction.opening_hours}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">₹{attraction.ticket_price}</span>
                <Button size="sm" onClick={() => handlePurchase(attraction)}>Book</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
