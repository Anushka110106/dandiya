import React, { useState } from 'react';
import { BookOpen, Sparkles, Leaf, Sun, Heart, ChevronDown } from 'lucide-react';

interface CulturalFact {
  id: number;
  title: string;
  icon: React.ReactNode;
  shortDescription: string;
  longDescription: string;
}

const CulturalExplorer: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const culturalFacts: CulturalFact[] = [
    {
      id: 1,
      title: "The Nine Nights of Navratri",
      icon: <Sparkles className="w-6 h-6" />,
      shortDescription: "Explore the significance of each of the nine divine nights dedicated to Goddess Durga.",
      longDescription: "Navratri, meaning 'nine nights', is a Hindu festival celebrated over nine nights and ten days. Each day is dedicated to a different incarnation of Goddess Durga, symbolizing the victory of good over evil. The festival culminates in Dussehra, celebrating Lord Rama's victory over Ravana or Goddess Durga's victory over the demon Mahishasura."
    },
    {
      id: 2,
      title: "Origins of Garba & Dandiya Raas",
      icon: <BookOpen className="w-6 h-6" />,
      shortDescription: "Uncover the ancient roots and evolution of these vibrant folk dances.",
      longDescription: "Garba is a devotional dance form originating from Gujarat, performed in circles around a lamp or an idol of Goddess Durga. The circular movements symbolize the cyclical nature of life. Dandiya Raas is another folk dance from Gujarat, performed with colorful sticks (dandiyas) that represent the swords of Goddess Durga. It depicts a mock fight between the Goddess and the demon Mahishasura."
    },
    {
      id: 3,
      title: "Significance of Colors",
      icon: <Leaf className="w-6 h-6" />,
      shortDescription: "Learn about the traditional colors associated with each day of Navratri and their meanings.",
      longDescription: "Each day of Navratri is associated with a specific color, symbolizing different virtues and aspects of the Goddess. For example, red signifies passion and auspiciousness, white for peace, yellow for brightness and happiness, and green for new beginnings and nature. Devotees often wear these colors to honor the respective forms of Durga."
    },
    {
      id: 4,
      title: "The Aarti Ceremony",
      icon: <Sun className="w-6 h-6" />,
      shortDescription: "Understand the spiritual importance and rituals of the daily Aarti during Navratri.",
      longDescription: "Aarti is a Hindu ritual of worship in which light from wicks soaked in ghee or camphor is offered to deities. During Navratri, Aarti is performed daily, often accompanied by devotional songs and prayers. It symbolizes the removal of darkness and the presence of divine light, purifying the atmosphere and invoking blessings."
    },
    {
      id: 5,
      title: "Community & Celebration",
      icon: <Heart className="w-6 h-6" />,
      shortDescription: "Discover how Navratri fosters unity, joy, and cultural preservation.",
      longDescription: "Navratri is a time for community gathering, joyous celebrations, and cultural exchange. It brings people together through dance, music, food, and shared devotion. The festival emphasizes family values, traditional arts, and the spirit of togetherness, reinforcing cultural identity across generations."
    }
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-yellow-300 mr-3" />
          <h3 className="text-3xl font-bold text-white">Tradition Meets Festivity Here 🌟</h3>
        </div>
        <p className="text-white/80">Dive deep into the traditions and meanings behind Navratri & Dandiya!</p>
      </div>

      <div className="space-y-6">
        {culturalFacts.map((fact) => (
          <div
            key={fact.id}
            className="bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            onClick={() => toggleExpand(fact.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white">
                  {fact.icon}
                </div>
                <h4 className="text-xl font-bold text-white">{fact.title}</h4>
              </div>
              <ChevronDown
                className={`w-6 h-6 text-white transition-transform duration-300 ${
                  expandedId === fact.id ? 'rotate-180' : ''
                }`}
              />
            </div>
            
            {expandedId !== fact.id && (
              <p className="text-white/80 mt-4 leading-relaxed animate-fadeIn">
                {fact.shortDescription}
              </p>
            )}

            {expandedId === fact.id && (
              <div className="mt-4 animate-fadeIn">
                <p className="text-white/90 leading-relaxed">{fact.longDescription}</p>
                <div className="mt-4 bg-yellow-400/20 rounded-lg p-3 border border-yellow-300/30">
                  <p className="text-yellow-300 font-semibold text-sm">
                    Click to collapse and explore more cultural insights!
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg p-4 border border-yellow-300/30">
          <p className="text-yellow-300 font-semibold">
            🕉️ Embrace the spirit of Navratri and experience the cultural richness of Dandiya! 🕉️
          </p>
        </div>
      </div>
    </div>
  );
};

export default CulturalExplorer;
