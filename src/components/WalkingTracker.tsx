import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Activity, TrendingUp, Target } from 'lucide-react';
import toast from 'react-hot-toast';

interface WalkingStats {
  date: string;
  steps_count: number;
  distance_km: number;
}

const WalkingTracker: React.FC = () => {
  const [stats, setStats] = useState<WalkingStats[]>([]);
  const [newStats, setNewStats] = useState({
    steps: '',
    distance: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('walking_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7);

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching walking stats:', error);
      toast.error('Failed to load walking stats');
    } finally {
      setLoading(false);
    }
  }

  async function addStats(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('walking_stats')
        .insert([
          {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            steps_count: parseInt(newStats.steps),
            distance_km: parseFloat(newStats.distance)
          }
        ]);

      if (error) throw error;
      toast.success('Walking stats added successfully');
      fetchStats();
      setNewStats({ steps: '', distance: '' });
    } catch (error) {
      console.error('Error adding walking stats:', error);
      toast.error('Failed to add walking stats');
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Activity className="w-6 h-6 text-purple-600 mr-2" />
        Walking Tracker
      </h3>

      <form onSubmit={addStats} className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Steps</label>
            <input
              type="number"
              value={newStats.steps}
              onChange={(e) => setNewStats({...newStats, steps: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Distance (km)</label>
            <input
              type="number"
              step="0.01"
              value={newStats.distance}
              onChange={(e) => setNewStats({...newStats, distance: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Add Today's Stats
        </button>
      </form>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">{new Date(stat.date).toLocaleDateString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
                <span className="font-semibold">{stat.steps_count.toLocaleString()} steps</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center">
                <Target className="w-4 h-4 text-purple-600 mr-2" />
                <span>{stat.distance_km} km</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalkingTracker;