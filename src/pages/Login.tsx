import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Heart, AlertCircle, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.3
    }
  }
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

const inputVariants = {
  focus: { 
    scale: 1.02,
    boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.3)",
    transition: { duration: 0.2 }
  },
  blur: { 
    scale: 1,
    boxShadow: "none",
    transition: { duration: 0.2 }
  }
};

const svgVariants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

const pathVariants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: {
      duration: 1,
      ease: "easeInOut"
    }
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  }

  async function checkEmailExists(email: string) {
    try {
      const { data, error } = await supabase.rpc('check_email_exists', {
        email_address: email
      });
      
      if (error) throw error;
      setEmailExists(data);
      return data;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        await supabase.from('user_logins').insert({
          email: email.trim(),
          success: false,
          user_id: null
        });
        
        setFormError('Invalid email or password');
        toast.error('Invalid email or password. Please try again.');
        return;
      }

      if (data.user) {
        await supabase.from('user_logins').insert({
          email: email.trim(),
          success: true,
          user_id: data.user.id
        });

        toast.success('Welcome back!', {
          icon: '👋',
          duration: 3000
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/');
      }
    } catch (error: any) {
      setFormError('An unexpected error occurred');
      toast.error('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      const exists = await checkEmailExists(email.trim());
      
      if (exists) {
        setFormError('Email already exists');
        toast.error('An account with this email already exists. Please log in instead.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        if (error.message.includes('Password')) {
          setFormError('Password should be at least 6 characters');
          toast.error('Password should be at least 6 characters long');
        } else if (error.message.includes('email')) {
          setFormError('Invalid email format');
          toast.error('Please enter a valid email address');
        } else {
          setFormError(error.message);
          toast.error(error.message);
        }
        return;
      }

      if (data?.user) {
        await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: '',
              age: null,
              medical_history: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        toast.success('Account created successfully!', {
          icon: '🎉',
          duration: 4000
        });
        setIsSignUp(false);
      }
    } catch (error: any) {
      setFormError('An unexpected error occurred');
      toast.error('An error occurred during sign up. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="p-8">
            <motion.div 
              className="flex justify-center mb-8"
              variants={svgVariants}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Heart className="w-16 h-16 text-purple-600" />
              </motion.div>
            </motion.div>

            <motion.h2 
              className="text-3xl font-bold text-center text-gray-800 mb-8"
              variants={itemVariants}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </motion.h2>

            <AnimatePresence mode="wait">
              <motion.form
                key={isSignUp ? 'signup' : 'login'}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={isSignUp ? handleSignUp : handleLogin}
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                    className="relative"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value) {
                          checkEmailExists(e.target.value);
                        }
                      }}
                      className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                      placeholder="Enter your email"
                    />
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </motion.div>
                  <AnimatePresence>
                    {emailExists && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-purple-600 mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This email is already registered
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                    className="relative"
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                      placeholder="Enter your password"
                      minLength={6}
                    />
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200 disabled:opacity-50 relative overflow-hidden"
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </motion.div>
                  ) : (
                    <span>{isSignUp ? 'Create Account' : 'Login'}</span>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full bg-white text-purple-600 py-3 rounded-lg border border-purple-600 hover:bg-purple-50 transition duration-200"
                >
                  {isSignUp ? 'Already have an account? Login' : 'Create new account'}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-sm text-gray-600 text-center"
            >
              Default credentials: anshu123@gmail.com / anshu123
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}