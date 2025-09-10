import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Users } from 'lucide-react';

const DandiyaTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Basic Dandiya Hold",
      description: "Hold the dandiya sticks lightly in your hands, one in each hand. Keep your grip relaxed and natural.",
      emoji: "🥢",
      tips: "Keep your wrists flexible for smooth movements"
    },
    {
      title: "Forward Strike",
      description: "Strike your partner's right stick with your right stick in a forward motion. This is the basic beat.",
      emoji: "⚡",
      tips: "Maintain eye contact and smile - it's about joy!"
    },
    {
      title: "Side Strike",
      description: "After the forward strike, move to strike your partner's left stick with your left stick from the side.",
      emoji: "↔️",
      tips: "Keep the rhythm steady and consistent"
    },
    {
      title: "Circular Movement",
      description: "Move in a circular pattern around your partner while maintaining the striking rhythm.",
      emoji: "🔄",
      tips: "Stay light on your feet and follow the music"
    },
    {
      title: "Group Formation",
      description: "Form circles with multiple couples, creating beautiful patterns as you dance together.",
      emoji: "⭕",
      tips: "Coordinate with the group for synchronized movements"
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % tutorialSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + tutorialSteps.length) % tutorialSteps.length);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4">Learn Dandiya Steps</h3>
        <p className="text-white/80">Master the basics before the event!</p>
      </div>

      <div className="relative">
        <div className="bg-white/20 rounded-xl p-6 min-h-[300px] flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{tutorialSteps[currentStep].emoji}</div>
            <h4 className="text-2xl font-bold text-yellow-300 mb-3">
              Step {currentStep + 1}: {tutorialSteps[currentStep].title}
            </h4>
          </div>
          
          <p className="text-white text-lg mb-4 text-center leading-relaxed">
            {tutorialSteps[currentStep].description}
          </p>
          
          <div className="bg-yellow-400/20 rounded-lg p-4 border border-yellow-300/30">
            <p className="text-yellow-300 font-semibold text-center">
              💡 Tip: {tutorialSteps[currentStep].tips}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevStep}
            className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>
          
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentStep ? 'bg-yellow-300' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextStep}
            className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg p-4 border border-white/20">
          <Users className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
          <p className="text-white font-semibold">
            Practice with friends and family before the event!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DandiyaTutorial;