import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '@/contexts/CountdownContext';

export function CountdownTimer() {
  const { settings, getRemainingTime } = useCountdown();
  const [timeLeft, setTimeLeft] = useState(getRemainingTime());

  useEffect(() => {
    if (!settings.isActive) return;

    const timer = setInterval(() => {
      const remaining = getRemainingTime();
      setTimeLeft(remaining);

      if (!remaining) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.isActive, settings.endDate]);

  if (!settings.isActive || !timeLeft) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <motion.div
            key={unit}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="bg-white text-red-600 rounded-md p-1 min-w-[32px] text-center">
              <span className="text-sm font-bold">{value}</span>
            </div>
            <span className="text-[10px] mt-0.5 text-white/80 capitalize">{unit}</span>
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm text-white font-medium">{settings.title}</p>
        <p className="text-xs text-white/80">{settings.description}</p>
      </div>
    </div>
  );
}