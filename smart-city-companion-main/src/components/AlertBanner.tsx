import { Alert as AlertType } from '@/types/tourism';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  alerts: AlertType[];
}

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const alertStyles = {
  info: 'alert-info',
  warning: 'alert-warning',
  danger: 'alert-danger',
};

export function AlertBanner({ alerts }: AlertBannerProps) {
  const { t } = useLanguage();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter((alert) => !dismissedIds.has(alert.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      <AnimatePresence>
        {visibleAlerts.map((alert) => {
          const Icon = alertIcons[alert.alert_type as keyof typeof alertIcons] || Info;
          const style = alertStyles[alert.alert_type as keyof typeof alertStyles] || 'alert-info';

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                style
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {t(alert.title, alert.title_es)}
                </p>
                <p className="text-xs opacity-90 mt-0.5">
                  {t(alert.message, alert.message_es)}
                </p>
              </div>
              <button
                onClick={() => setDismissedIds((prev) => new Set([...prev, alert.id]))}
                className="p-1 rounded hover:bg-background/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
