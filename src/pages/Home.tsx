import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Book, MessageCircle, Phone, Activity, Apple, Cog as Yoga } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { supabase } from '../lib/supabase';
import ExerciseCard from '../components/ExerciseCard';
import DietPlanCard from '../components/DietPlanCard';
import ExpertTalks from '../components/ExpertTalks';
import WalkingTracker from '../components/WalkingTracker';
import Scene from '../components/3D/Scene';
import AnimatedCard from '../components/AnimatedCard';

interface Profile {
  age: number | null;
  medical_history: string | null;
}

interface DietPlan {
  title: string;
  description: string;
  calories: number;
  meal_type: string;
}

interface ExerciseTutorial {
  title: string;
  description: string;
  difficulty_level: string;
  duration_minutes: number;
}

const exerciseVideos = [
  {
    title: "Morning Yoga for PCOD",
    description: "Gentle yoga poses to help balance hormones and reduce stress",
    duration: 20,
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    benefits: [
      "Improves insulin sensitivity",
      "Reduces stress levels",
      "Helps with weight management",
      "Balances hormones"
    ]
  },
  {
    title: "PCOD Workout Routine",
    description: "Low-impact cardio exercises suitable for PCOD patients",
    duration: 30,
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    benefits: [
      "Burns calories effectively",
      "Improves cardiovascular health",
      "Helps regulate menstrual cycle",
      "Boosts metabolism"
    ]
  }
];

const dietPlans = [
  {
    title: "Anti-Inflammatory Diet Plan",
    description: "A balanced diet plan focused on reducing inflammation and managing PCOD symptoms",
    totalCalories: 1800,
    meals: [
      {
        time: "Breakfast (8:00 AM)",
        items: [
          "Oatmeal with berries and nuts",
          "Green tea",
          "1 medium apple"
        ],
        calories: 400
      },
      {
        time: "Mid-Morning (11:00 AM)",
        items: [
          "Greek yogurt",
          "Mixed seeds",
          "Cinnamon"
        ],
        calories: 200
      },
      {
        time: "Lunch (2:00 PM)",
        items: [
          "Quinoa bowl with grilled vegetables",
          "Lean protein (chicken/tofu)",
          "Olive oil dressing"
        ],
        calories: 500
      },
      {
        time: "Evening Snack (5:00 PM)",
        items: [
          "Handful of almonds",
          "Green tea",
          "1 medium orange"
        ],
        calories: 200
      },
      {
        time: "Dinner (8:00 PM)",
        items: [
          "Grilled fish",
          "Steamed vegetables",
          "Brown rice",
          "Lemon-herb sauce"
        ],
        calories: 500
      }
    ],
    tips: [
      "Avoid processed foods and refined sugars",
      "Include anti-inflammatory foods like turmeric and ginger",
      "Stay hydrated with 8-10 glasses of water daily",
      "Eat at regular intervals to maintain blood sugar levels"
    ]
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userDietPlans, setUserDietPlans] = useState<DietPlan[]>([]);
  const [exercises, setExercises] = useState<ExerciseTutorial[]>([]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [profileData, dietData, exerciseData] = await Promise.all([
          supabase.from('profiles').select('age, medical_history').eq('id', user.id).single(),
          supabase.from('diet_plans').select('*'),
          supabase.from('exercise_tutorials').select('*')
        ]);

        if (profileData.data) setProfile(profileData.data);
        if (dietData.data) setUserDietPlans(dietData.data);
        if (exerciseData.data) setExercises(exerciseData.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-gray-600">{t('home.subtitle')}</p>
          
          <div className="mt-8">
            <Scene />
          </div>
        </motion.section>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          <AnimatedCard delay={0.1}>
            <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <Heart className="w-12 h-12 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">Personalized</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.care.title')}</h3>
              <p className="text-gray-600 mb-4">{t('home.features.care.description')}</p>
              
              {profile && (
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Your Recommendations</h4>
                    {userDietPlans.length > 0 && (
                      <div className="flex items-center mb-2">
                        <Apple className="w-5 h-5 text-purple-600 mr-2" />
                        <span>{userDietPlans[0].title}</span>
                      </div>
                    )}
                    {exercises.length > 0 && (
                      <div className="flex items-center">
                        <Activity className="w-5 h-5 text-purple-600 mr-2" />
                        <span>{exercises[0].title}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <Book className="w-12 h-12 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">Knowledge</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.resources.title')}</h3>
              <p className="text-gray-600">{t('home.features.resources.description')}</p>
              <Link to="/resources" className="mt-4 inline-block text-purple-600 hover:text-purple-700">
                Learn more →
              </Link>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <MessageCircle className="w-12 h-12 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">24/7 Support</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.chat.title')}</h3>
              <p className="text-gray-600">{t('home.features.chat.description')}</p>
              <Link to="/chat" className="mt-4 inline-block text-purple-600 hover:text-purple-700">
                Start chat →
              </Link>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.4}>
            <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <Phone className="w-12 h-12 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">Expert Help</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.expert.title')}</h3>
              <p className="text-gray-600">{t('home.features.expert.description')}</p>
              <Link to="/contact" className="mt-4 inline-block text-purple-600 hover:text-purple-700">
                Connect now →
              </Link>
            </div>
          </AnimatedCard>
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <WalkingTracker />
        </motion.section>

        <motion.section
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Yoga className="w-8 h-8 text-purple-600 mr-3" />
            Exercise & Yoga Videos
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {exerciseVideos.map((video, index) => (
              <motion.div key={index} variants={item}>
                <ExerciseCard {...video} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Apple className="w-8 h-8 text-purple-600 mr-3" />
            Personalized Diet Plans
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {dietPlans.map((plan, index) => (
              <motion.div key={index} variants={item}>
                <DietPlanCard {...plan} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ExpertTalks />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Wellness"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-transparent flex items-center">
            <div className="p-8 text-white max-w-lg">
              <h2 className="text-3xl font-bold mb-4">Start Your Wellness Journey Today</h2>
              <p className="mb-6">Join our community of women supporting each other through their PCOD journey.</p>
              <Link
                to="/profile"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition duration-200"
              >
                Complete Your Profile
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}