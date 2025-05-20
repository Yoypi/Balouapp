import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Données de récompenses
const rewards = [
  { id: 1, name: 'Carte Amazon 50€', points: 500, image: 'https://cdn-icons-png.flaticon.com/512/5968/5968885.png' },
  { id: 2, name: 'Casque Premium', points: 800, image: 'https://cdn-icons-png.flaticon.com/512/3659/3659784.png' },
  { id: 3, name: 'Abonnement Spotify', points: 300, image: 'https://cdn-icons-png.flaticon.com/512/174/174872.png' },
];

// Données d'activité
const activities = [
  { type: 'steps', value: 5234, date: '2024-03-20', points: 52 },
  { type: 'steps', value: 4876, date: '2024-03-19', points: 48 },
  { type: 'steps', value: 6123, date: '2024-03-18', points: 61 },
];

export default function Dashboard() {
  const [user, setUser] = useState({ email: '', points: 0 });
  const [currentSteps, setCurrentSteps] = useState(0);
  const [targetSteps, setTargetSteps] = useState(10000);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('isLogged') !== 'true') {
      router.replace('/');
      return;
    }
    const current = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const u = users.find(u => u.email === current);
    setUser(u || { email: current, points: 0 });
    setLoading(false);
  }, []);

  useEffect(() => {
    // Simuler la mise à jour des pas en temps réel
    const interval = setInterval(() => {
      setCurrentSteps(prev => {
        const newSteps = prev + Math.floor(Math.random() * 10);
        return newSteps > targetSteps ? targetSteps : newSteps;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [targetSteps]);

  const handleRipple = (e) => {
    const button = buttonRef.current;
    if (!button) return;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('currentUser');
    router.replace('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-700 relative overflow-hidden">
      <Head>
        <title>Tableau de bord | Etlecktik</title>
      </Head>

      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <motion.img
              src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
              alt="Logo"
              className="w-12 h-12 drop-shadow-xl"
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Bienvenue, {user.email}</h1>
              <p className="text-white/80">Votre tableau de bord personnel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-white hover:text-purple-200 transition-colors">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"/>
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Pas aujourd'hui</h3>
              <span className="text-white/60">{Math.round((currentSteps / targetSteps) * 100)}%</span>
            </div>
            <div className="relative h-2 bg-white/20 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentSteps / targetSteps) * 100}%` }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>{currentSteps.toLocaleString()} pas</span>
              <span>{targetSteps.toLocaleString()} pas</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-white font-semibold mb-4">Points totaux</h3>
            <div className="text-3xl font-bold text-white mb-2">{user.points}</div>
            <p className="text-white/60 text-sm">Points disponibles pour les récompenses</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-white font-semibold mb-4">Objectif du jour</h3>
            <div className="flex items-center gap-2 text-white/80">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Atteindre {targetSteps.toLocaleString()} pas</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-6">Activité récente</h3>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.value.toLocaleString()} pas</p>
                      <p className="text-white/60 text-sm">{new Date(activity.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="text-white font-semibold">+{activity.points} pts</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-6">Récompenses disponibles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 rounded-xl p-4 flex items-center gap-4"
                >
                  <img src={reward.image} alt={reward.name} className="w-12 h-12 object-contain" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{reward.name}</h4>
                    <p className="text-white/60 text-sm">{reward.points} points</p>
                  </div>
                  <button
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      user.points >= reward.points
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                    disabled={user.points < reward.points}
                  >
                    Échanger
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} Etlecktik. Tous droits réservés.
        </div>
      </div>

      <style jsx global>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background-color: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          z-index: 10;
        }
        @keyframes ripple {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 