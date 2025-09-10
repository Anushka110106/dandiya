import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  // Set event date (you can modify this date)
  const eventDate = new Date('2025-09-28T18:00:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
      <div className="flex items-center justify-center mb-6">
        <Clock className="w-8 h-8 text-yellow-300 mr-3" />
        <h3 className="text-2xl font-bold text-white">Event Countdown</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} className="bg-white/20 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-300 mb-2">
              {item.value.toString().padStart(2, '0')}
            </div>
            <div className="text-white text-sm uppercase tracking-wide">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-white/80 mt-6">
        Until the Maha-Bhanga begins! 🔥
      </p>
    </div>
  );
};

export default CountdownTimer;
