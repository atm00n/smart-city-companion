import { motion } from 'framer-motion';
import { Train, Bus, Zap, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/useLanguage';

const metroLines = [
  { name: 'Purple Line', color: 'bg-purple-500', route: 'PCMC ↔ Swargate', status: 'Operational', stops: 15 },
  { name: 'Aqua Line', color: 'bg-cyan-500', route: 'Vanaz ↔ Ramwadi', status: 'Operational', stops: 17 },
];

const busRoutes = [
  { number: '101', route: 'Pune Station ↔ Shivajinagar', frequency: '10 min' },
  { number: '154', route: 'Swargate ↔ Hadapsar', frequency: '15 min' },
  { number: '168', route: 'Katraj ↔ Nigdi', frequency: '20 min' },
];

const evStations = [
  { name: 'Ather Grid - FC Road', type: 'Fast Charging', available: true },
  { name: 'Tata Power - Koregaon Park', type: 'DC Fast', available: true },
  { name: 'EESL - Shivajinagar', type: 'Standard', available: false },
];

export default function MobilityPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Bus className="h-6 w-6 text-primary" />
          {t.mobility}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Navigate Pune with ease</p>
      </motion.div>

      {/* Metro */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              {t.metroRoutes}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metroLines.map((line) => (
              <div key={line.name} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className={`w-3 h-12 rounded-full ${line.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{line.name}</span>
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                      {line.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{line.route}</p>
                  <p className="text-xs text-muted-foreground">{line.stops} stops</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Buses */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bus className="h-5 w-5 text-accent" />
              {t.busRoutes}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {busRoutes.map((bus) => (
              <div key={bus.number} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Badge className="bg-accent text-accent-foreground">{bus.number}</Badge>
                  <span className="text-sm">{bus.route}</span>
                </div>
                <span className="text-xs text-muted-foreground">Every {bus.frequency}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* EV Charging */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              {t.evCharging}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {evStations.map((station) => (
              <div key={station.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{station.name}</p>
                    <p className="text-xs text-muted-foreground">{station.type}</p>
                  </div>
                </div>
                <Badge variant="outline" className={station.available ? 'text-success border-success/30' : 'text-destructive border-destructive/30'}>
                  {station.available ? 'Available' : 'In Use'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
