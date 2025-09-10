import React, { useState } from 'react';
import { Clock, Music, Users, Star, Mic, Award } from 'lucide-react';

interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'performance' | 'activity' | 'break' | 'special';
}

const EventSchedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const scheduleData: ScheduleItem[] = [
    {
      time: "6:00 PM",
      title: "Welcome & Registration",
      description: "Check-in, welcome drinks, and traditional tilaka ceremony",
      icon: <Users className="w-6 h-6" />,
      type: "activity"
    },
    {
      time: "6:30 PM",
      title: "Opening Ceremony",
      description: "Traditional lamp lighting and blessing ceremony",
      icon: <Star className="w-6 h-6" />,
      type: "special"
    },
    {
      time: "7:00 PM",
      title: "Garba Warm-up",
      description: "Learn basic steps with our dance instructors",
      icon: <Music className="w-6 h-6" />,
      type: "activity"
    },
    {
      time: "7:30 PM",
      title: "Live DJ Performance",
      description: "High-energy Gujarati folk and Bollywood fusion",
      icon: <Mic className="w-6 h-6" />,
      type: "performance"
    },
    {
      time: "8:30 PM",
      title: "Dandiya Competition",
      description: "Participate in our exciting Dandiya dance competition",
      icon: <Award className="w-6 h-6" />,
      type: "special"
    },
    {
      time: "9:00 PM",
      title: "Dinner Break",
      description: "Traditional Gujarati thali and refreshments",
      icon: <Clock className="w-6 h-6" />,
      type: "break"
    },
    {
      time: "9:45 PM",
      title: "Maha-Bhanga Session",
      description: "The ultimate high-energy dance session",
      icon: <Music className="w-6 h-6" />,
      type: "performance"
    },
    {
      time: "11:00 PM",
      title: "Prize Distribution",
      description: "Awards for best dancers and participants",
      icon: <Award className="w-6 h-6" />,
      type: "special"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'from-red-500 to-orange-500';
      case 'special': return 'from-yellow-500 to-orange-500';
      case 'activity': return 'from-orange-500 to-red-500';
      case 'break': return 'from-gray-500 to-gray-600';
      default: return 'from-red-500 to-orange-500';
    }
  };

  const getTypeBorder = (type: string) => {
    switch (type) {
      case 'performance': return 'border-red-400';
      case 'special': return 'border-yellow-400';
      case 'activity': return 'border-orange-400';
      case 'break': return 'border-gray-400';
      default: return 'border-red-400';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4">Every Colorful Moment, Mapped Out for You 🕯️</h3>
        <p className="text-white/80">Your complete guide to the Maha-Bhanga experience (<em>tentative</em>)</p>
      </div>

      <div className="space-y-4">
        {scheduleData.map((item, index) => (
          <div
            key={index}
            className={`bg-white/10 rounded-xl p-6 border-l-4 ${getTypeBorder(item.type)} hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]`}
            onClick={() => setActiveTab(activeTab === index ? -1 : index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`bg-gradient-to-r ${getTypeColor(item.type)} p-3 rounded-lg text-white`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-yellow-300 font-bold text-lg">{item.time}</div>
                  <div className="text-white font-semibold text-xl">{item.title}</div>
                </div>
              </div>
              <div className="text-white/60">
                {activeTab === index ? '−' : '+'}
              </div>
            </div>
            
            {activeTab === index && (
              <div className="mt-4 pl-16 animate-fadeIn">
                <p className="text-white/90 leading-relaxed">{item.description}</p>
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTypeColor(item.type)} text-white`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg p-4 border border-yellow-300/30">
          <p className="text-yellow-300 font-semibold">
            🎵 Schedule may vary based on crowd energy and participation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventSchedule;
