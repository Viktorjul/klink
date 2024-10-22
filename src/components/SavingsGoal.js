import React, { useState, useEffect } from 'react';

function SavingsGoal({ currentYearlySavings, yearlyGoal }) {
  // Animated states
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);
  const [animatedGoal, setAnimatedGoal] = useState(0);

  // Calculate final percentage (capped at 100%)
  const finalPercentage = Math.min(Math.round((currentYearlySavings / yearlyGoal) * 100), 100);

  // Format numbers in Icelandic style: 1.000 kr
  const formatCurrency = (amount) => {
    const formattedNumber = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedNumber} kr`;
  };

  // Calculate circular progress bar dimensions
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  // Animation effect
  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const steps = 60; // 60 steps for smooth animation
    const interval = animationDuration / steps;

    // Calculate step sizes
    const percentageStep = finalPercentage / steps;
    const savingsStep = currentYearlySavings / steps;
    const goalStep = yearlyGoal / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;

      if (currentStep <= steps) {
        setAnimatedPercentage(prev => 
          Math.min(finalPercentage, prev + percentageStep)
        );
        setAnimatedSavings(prev => 
          Math.min(currentYearlySavings, prev + savingsStep)
        );
        setAnimatedGoal(prev => 
          Math.min(yearlyGoal, prev + goalStep)
        );
      } else {
        // Ensure final values are exact
        setAnimatedPercentage(finalPercentage);
        setAnimatedSavings(currentYearlySavings);
        setAnimatedGoal(yearlyGoal);
        clearInterval(timer);
      }
    }, interval);

    // Cleanup
    return () => clearInterval(timer);
  }, [currentYearlySavings, yearlyGoal, finalPercentage]);

  // Calculate current progress circle offset
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Yearly Savings Goal</h2>
      {/* Progress circle container */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle (gray) */}
            <circle 
              cx="50" 
              cy="50" 
              r={radius}
              fill="none" 
              stroke="#e5e7eb" 
              strokeWidth="10"
            />
            {/* Progress circle (purple) */}
            <circle 
              cx="50" 
              cy="50" 
              r={radius}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
              className="transition-all duration-100 ease-out"
            />
          </svg>
          {/* Percentage display in circle center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold">
              {Math.round(animatedPercentage)}%
            </span>
            <span className="text-sm text-gray-500">of goal</span>
          </div>
        </div>
      </div>
      {/* Goal amount display */}
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">
          Goal: {formatCurrency(animatedGoal)}
        </p>
        <p className="text-gray-500">
          Saved this year: {formatCurrency(animatedSavings)}
        </p>
      </div>
    </div>
  );
}

export default SavingsGoal;