import React from 'react';
import ReactPlayer from 'react-player';
import { Clock, Activity, Target } from 'lucide-react';

interface ExerciseCardProps {
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  videoUrl: string;
  benefits: string[];
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  description,
  duration,
  difficulty,
  videoUrl,
  benefits
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
      <div className="aspect-w-16 aspect-h-9">
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls
          light
          playing={false}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-purple-600 mr-2" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-purple-600 mr-2" />
            <span>{difficulty}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <Target className="w-5 h-5 text-purple-600 mr-2" />
            Benefits
          </h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;