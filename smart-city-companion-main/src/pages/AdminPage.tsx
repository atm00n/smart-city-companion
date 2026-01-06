import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAttractions, useAlerts } from '@/hooks/useAttractions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { data: attractions } = useAttractions();
  const { data: alerts } = useAlerts();
  const [alertForm, setAlertForm] = useState({ title: '', message: '', type: 'info' });

  const addAlert = async () => {
    if (!alertForm.title || !alertForm.message) {
      toast.error('Please fill all fields');
      return;
    }

    const { error } = await supabase.from('alerts').insert({
      title: alertForm.title,
      message: alertForm.message,
      alert_type: alertForm.type,
      is_active: true,
    });

    if (error) {
      toast.error('Failed to add alert');
      return;
    }

    toast.success('Alert added');
    setAlertForm({ title: '', message: '', type: 'info' });
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
  };

  const deleteAlert = async (id: string) => {
    const { error } = await supabase.from('alerts').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
      return;
    }
    toast.success('Alert deleted');
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Admin Panel
        </h1>
        <p className="text-sm text-muted-foreground">Manage attractions and alerts</p>
      </motion.div>

      {/* Add Alert */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-base">Add Alert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Alert title"
            value={alertForm.title}
            onChange={(e) => setAlertForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Textarea
            placeholder="Alert message"
            value={alertForm.message}
            onChange={(e) => setAlertForm((f) => ({ ...f, message: e.target.value }))}
          />
          <div className="flex gap-2">
            {['info', 'warning', 'danger'].map((type) => (
              <Button
                key={type}
                variant={alertForm.type === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlertForm((f) => ({ ...f, type }))}
              >
                {type}
              </Button>
            ))}
          </div>
          <Button onClick={addAlert} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Alert
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-base">Active Alerts ({alerts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {alerts?.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-sm">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attractions Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Attractions ({attractions?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-60 overflow-y-auto">
          {attractions?.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-2 rounded bg-secondary/30 text-sm">
              <span>{a.name}</span>
              <span className="text-xs text-muted-foreground">{a.category}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
