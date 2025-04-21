import React from 'react';
import { Apple, Clock, Flame } from 'lucide-react';

interface Meal {
  time: string;
  items: string[];
  calories: number;
}

interface DietPlanCardProps {
  title: string;
  description: string;
  totalCalories: number;
  meals: Meal[];
  tips: string[];
}

const DietPlanCard: React.FC<DietPlanCardProps> = ({
  title,
  description,
  totalCalories,
  meals,
  tips
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center text-purple-600">
          <Flame className="w-5 h-5 mr-2" />
          <span>{totalCalories} kcal</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="space-y-6">
        {meals.map((meal, index) => (
          <div key={index} className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-semibold">{meal.time}</span>
              </div>
              <span className="text-sm text-gray-500">{meal.calories} kcal</span>
            </div>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {meal.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold flex items-center mb-3">
          <Apple className="w-5 h-5 text-purple-600 mr-2" />
          Nutrition Tips
        </h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DietPlanCard;