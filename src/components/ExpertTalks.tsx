import React from 'react';
import ReactPlayer from 'react-player';
import { Award, Star } from 'lucide-react';

interface ExpertTalk {
  title: string;
  description: string;
  video_url: string;
  expert_name: string;
  expert_credentials: string;
}

const expertTalks: ExpertTalk[] = [
  {
    title: "Understanding PCOD: Causes and Management",
    description: "Dr. Sarah Johnson explains the root causes of PCOD and effective management strategies.",
    video_url: "https://www.youtube.com/watch?v=example1",
    expert_name: "Dr. Sarah Johnson",
    expert_credentials: "Gynecologist, Women's Health Specialist"
  },
  {
    title: "Lifestyle Changes for PCOD",
    description: "Learn about essential lifestyle modifications to manage PCOD symptoms effectively.",
    video_url: "https://www.youtube.com/watch?v=example2",
    expert_name: "Dr. Emily Chen",
    expert_credentials: "Endocrinologist, PCOD Researcher"
  }
];

const ExpertTalks: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Award className="w-8 h-8 text-purple-600 mr-3" />
            Expert Talks on PCOD
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn from leading healthcare professionals about PCOD management and treatment options.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {expertTalks.map((talk, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="aspect-w-16 aspect-h-9">
                <ReactPlayer
                  url={talk.video_url}
                  width="100%"
                  height="100%"
                  controls
                  light
                  playing={false}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{talk.title}</h3>
                <p className="text-gray-600 mb-4">{talk.description}</p>
                
                <div className="flex items-start space-x-2">
                  <Star className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold">{talk.expert_name}</p>
                    <p className="text-sm text-gray-600">{talk.expert_credentials}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertTalks;