import { useState } from 'react';
import { useCountdown } from '@/contexts/CountdownContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Timer, Save } from 'lucide-react';
import { format } from 'date-fns';

export default function CountdownSettings() {
  const { settings, updateSettings } = useCountdown();
  const [formData, setFormData] = useState({
    endDate: format(new Date(settings.endDate), "yyyy-MM-dd'T'HH:mm"),
    isActive: settings.isActive,
    title: settings.title,
    description: settings.description
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      endDate: new Date(formData.endDate).toISOString()
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Compte à rebours</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres du compte à rebours
          </p>
        </div>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Paramètres du compte à rebours</h2>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Vente Flash"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Profitez de nos offres exceptionnelles"
              />
            </div>

            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </form>
      </Card>
    </div>
  );
}