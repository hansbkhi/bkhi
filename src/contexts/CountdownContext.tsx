import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface CountdownSettings {
  endDate: string;
  isActive: boolean;
  title: string;
  description: string;
}

interface CountdownContextType {
  settings: CountdownSettings;
  updateSettings: (settings: CountdownSettings) => void;
  getRemainingTime: () => { days: number; hours: number; minutes: number; seconds: number } | null;
}

const CountdownContext = createContext<CountdownContextType | undefined>(undefined);

export function CountdownProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CountdownSettings>(() => {
    const saved = localStorage.getItem('countdownSettings');
    return saved ? JSON.parse(saved) : {
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      title: 'Vente Flash',
      description: 'Profitez de nos offres exceptionnelles'
    };
  });

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('countdownSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: CountdownSettings) => {
    setSettings(newSettings);
    toast({
      title: "Paramètres mis à jour",
      description: "Le compte à rebours a été mis à jour avec succès"
    });
  };

  const getRemainingTime = () => {
    if (!settings.isActive) return null;

    const now = new Date().getTime();
    const endDate = new Date(settings.endDate).getTime();
    const difference = endDate - now;

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };

  return (
    <CountdownContext.Provider value={{
      settings,
      updateSettings,
      getRemainingTime
    }}>
      {children}
    </CountdownContext.Provider>
  );
}

export function useCountdown() {
  const context = useContext(CountdownContext);
  if (context === undefined) {
    throw new Error('useCountdown must be used within a CountdownProvider');
  }
  return context;
}