import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Calendar, Activity, FileText, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: string;
  full_name: string;
  age: number | null;
  medical_history: string;
  height?: number;
  weight?: number;
  blood_group?: string;
  allergies?: string;
  medications?: string;
  gender?: string;
  avatar_url?: string;
  walking_goal?: number;
}

interface PeriodCycle {
  id: string;
  cycle_start_date: string;
  cycle_end_date: string | null;
  symptoms: string[];
  notes: string;
}

const avatars = [
  {
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella&backgroundColor=b6e3f4',
    label: 'Avatar 1'
  },
  {
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ffdfbf',
    label: 'Avatar 2'
  },
  {
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova&backgroundColor=c0aede',
    label: 'Avatar 3'
  },
  {
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stella&backgroundColor=ffd5dc',
    label: 'Avatar 4'
  },
  {
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aurora&backgroundColor=d1f7c4',
    label: 'Avatar 5'
  }
];

const commonSymptoms = [
  'Cramps', 'Headache', 'Bloating', 'Fatigue',
  'Mood Swings', 'Back Pain', 'Breast Tenderness'
];

const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [periodCycles, setPeriodCycles] = useState<PeriodCycle[]>([]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [newCycle, setNewCycle] = useState({
    start_date: '',
    end_date: '',
    symptoms: [] as string[],
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      await Promise.all([
        fetchProfile(user.id),
        fetchPeriodCycles(user.id)
      ]);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/login');
    }
  }

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                full_name: '',
                age: null,
                medical_history: '',
                walking_goal: 10000
              }
            ]);
          
          if (insertError) throw insertError;
          
          const { data: newProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (fetchError) throw fetchError;
          setProfile(newProfile);
          setSelectedAvatar(newProfile?.avatar_url || '');
        } else {
          throw error;
        }
      } else {
        setProfile(data);
        setSelectedAvatar(data?.avatar_url || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function fetchPeriodCycles(userId: string) {
    try {
      const { data, error } = await supabase
        .from('period_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('cycle_start_date', { ascending: false });

      if (error) throw error;
      setPeriodCycles(data || []);
    } catch (error) {
      console.error('Error fetching period cycles:', error);
      toast.error('Failed to load period tracking data');
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          age: profile.age,
          medical_history: profile.medical_history,
          height: profile.height,
          weight: profile.weight,
          blood_group: profile.blood_group,
          allergies: profile.allergies,
          medications: profile.medications,
          gender: profile.gender,
          avatar_url: selectedAvatar,
          walking_goal: profile.walking_goal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      setEditing(false);
      setShowAvatarSelector(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  }

  async function addPeriodCycle(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('period_tracking')
        .insert([
          {
            user_id: user.id,
            cycle_start_date: newCycle.start_date,
            cycle_end_date: newCycle.end_date || null,
            symptoms: newCycle.symptoms,
            notes: newCycle.notes
          }
        ]);

      if (error) throw error;
      toast.success('Period cycle added successfully');
      fetchPeriodCycles(user.id);
      setNewCycle({ start_date: '', end_date: '', symptoms: [], notes: '' });
    } catch (error) {
      console.error('Error adding period cycle:', error);
      toast.error('Failed to add period cycle');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <User className="w-12 h-12 text-purple-600 mr-4" />
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-full overflow-hidden w-32 h-32 border-4 border-purple-200"
                >
                  {selectedAvatar ? (
                    <img 
                      src={selectedAvatar} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-purple-300" />
                    </div>
                  )}
                </motion.div>
                {editing && (
                  <button
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showAvatarSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Choose your avatar</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {avatars.map((avatar, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAvatar(avatar.url)}
                        className={`rounded-lg p-2 ${
                          selectedAvatar === avatar.url
                            ? 'ring-2 ring-purple-600 bg-purple-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.label}
                          className="w-full h-auto"
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {editing ? (
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile?.full_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={profile?.age || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, age: parseInt(e.target.value) || null} : null)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Gender</label>
                    <select
                      value={profile?.gender || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, gender: e.target.value} : null)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Daily Walking Goal (steps)</label>
                    <input
                      type="number"
                      value={profile?.walking_goal || 10000}
                      onChange={(e) => setProfile(prev => prev ? {...prev, walking_goal: parseInt(e.target.value) || 10000} : null)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={profile?.height || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, height: parseInt(e.target.value) || null} : null)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={profile?.weight || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, weight: parseInt(e.target.value) || null} : null)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Blood Group</label>
                    <input
                      type="text"
                      value={profile?.blood_group || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, blood_group: e.target.value} : null)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Allergies</label>
                    <input
                      type="text"
                      value={profile?.allergies || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, allergies: e.target.value} : null)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Current Medications</label>
                  <input
                    type="text"
                    value={profile?.medications || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, medications: e.target.value} : null)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Medical History</label>
                  <textarea
                    value={profile?.medical_history || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, medical_history: e.target.value} : null)}
                    rows={4}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                >
                  Save Changes
                </motion.button>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-gray-600 mb-1">Full Name</h2>
                  <p className="text-lg">{profile?.full_name || 'Not set'}</p>
                </div>

                <div>
                  <h2 className="text-gray-600 mb-1">Age</h2>
                  <p className="text-lg">{profile?.age || 'Not set'}</p>
                </div>

                <div>
                  <h2 className="text-gray-600 mb-1">Gender</h2>
                  <p className="text-lg">{profile?.gender || 'Not set'}</p>
                </div>

                <div>
                  <h2 className="text-gray-600 mb-1">Daily Walking Goal</h2>
                  <p className="text-lg">{profile?.walking_goal || 10000} steps</p>
                </div>

                <div>
                  <h2 className="text-gray-600 mb-1">Height</h2>
                  <p className="text-lg">{profile?.height ? `${profile.height} cm` : 'Not set'}</p>
                </div>

                <div>
                  <h2 className="text-gray-600 mb-1">Weight</h2>
                  <p className="text-lg">{profile?.weight ? `${profile.weight} kg` : 'Not set'}</p>
                </div>

                <div>
                  <h2 className="text-gray-600 mb-1">Blood Group</h2>
                  <p className="text-lg">{profile?.blood_group || 'Not set'}</p>
                </div>

                <div>
                  <h2 className="text-gray-600 mb-1">Allergies</h2>
                  <p className="text-lg">{profile?.allergies || 'None reported'}</p>
                </div>

                <div className="md:col-span-2">
                  <h2 className="text-gray-600 mb-1">Current Medications</h2>
                  <p className="text-lg">{profile?.medications || 'None reported'}</p>
                </div>

                <div className="md:col-span-2">
                  <h2 className="text-gray-600 mb-1">Medical History</h2>
                  <p className="text-lg whitespace-pre-wrap">{profile?.medical_history || 'Not set'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Period Tracking Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold">Period Tracking</h2>
            </div>

            {/* Add New Cycle Form */}
            <form onSubmit={addPeriodCycle} className="mb-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newCycle.start_date}
                    onChange={(e) => setNewCycle({...newCycle, start_date: e.target.value})}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newCycle.end_date}
                    onChange={(e) => setNewCycle({...newCycle, end_date: e.target.value})}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => {
                        const isSelected = newCycle.symptoms.includes(symptom);
                        setNewCycle({
                          ...newCycle,
                          symptoms: isSelected
                            ? newCycle.symptoms.filter(s => s !== symptom)
                            : [...newCycle.symptoms, symptom]
                        });
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newCycle.symptoms.includes(symptom)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newCycle.notes}
                  onChange={(e) => setNewCycle({...newCycle, notes: e.target.value})}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
              >
                Add Period Cycle
              </button>
            </form>

            {/* Period History */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-6 h-6 text-purple-600 mr-2" />
                Period History
              </h3>
              <div className="space-y-4">
                {periodCycles.map((cycle) => (
                  <div key={cycle.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">
                          {new Date(cycle.cycle_start_date).toLocaleDateString()}
                          {cycle.cycle_end_date && ` - ${new Date(cycle.cycle_end_date).toLocaleDateString()}`}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {cycle.symptoms.map((symptom, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {cycle.notes && (
                      <p className="text-gray-600 mt-2">{cycle.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}