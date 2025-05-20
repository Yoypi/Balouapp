import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

const messages = [
  "Chaque pas te rapproche de ta récompense !",
  "Continue, Etlecktik croit en toi !",
  "Plus tu marches, plus tu gagnes !",
  "Bouge, gagne, échange, recommence !",
  "Ta persévérance paie toujours !"
];

export default function HomePage() {
  const [steps, setSteps] = useState(5234);
  const [points, setPoints] = useState(120);
  const [displayedSteps, setDisplayedSteps] = useState(0);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const intervalRef = useRef();

  // Animation du compteur de points et pas
  useEffect(() => {
    let s = 0;
    let p = 0;
    intervalRef.current = setInterval(() => {
      if (s < steps) s += Math.ceil((steps - s) / 10);
      if (p < points) p += Math.ceil((points - p) / 10);
      setDisplayedSteps(s > steps ? steps : s);
      setDisplayedPoints(p > points ? points : p);
      if (s >= steps && p >= points) clearInterval(intervalRef.current);
    }, 30);
    return () => clearInterval(intervalRef.current);
  }, [steps, points]);

  // Animation des pas/points qui augmentent
  useEffect(() => {
    const interval = setInterval(() => {
      setSteps(s => s + Math.floor(Math.random() * 5));
      setPoints(p => p + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Message de motivation dynamique
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Effet ripple sur les boutons
  const handleRipple = (e) => {
    const button = e.currentTarget;
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700 relative overflow-hidden">
      <Head>
        <title>Accueil | Walk & Earn</title>
      </Head>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-10 w-full max-w-lg p-8 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-2xl border border-white/40"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
      >
        <div className="flex flex-col items-center mb-6">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
            alt="Logo"
            className="w-20 h-20 mb-2 drop-shadow-xl animate-bounce"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-1 tracking-tight">Bienvenue !</h1>
          <p className="text-purple-700 text-center text-lg font-semibold">Etlecktik</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-around mb-8 gap-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center bg-gradient-to-br from-purple-500 to-blue-400 text-white rounded-2xl px-8 py-6 shadow-xl border-2 border-white/40"
          >
            <span className="text-3xl font-extrabold tracking-widest animate-pulse">{displayedSteps}</span>
            <span className="text-xs uppercase tracking-wider">Pas</span>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl px-8 py-6 shadow-xl border-2 border-white/40"
          >
            <span className="text-3xl font-extrabold tracking-widest animate-pulse">{displayedPoints}</span>
            <span className="text-xs uppercase tracking-wider">Points</span>
          </motion.div>
        </div>
        <AnimatePresence>
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center text-lg font-semibold text-blue-700 mb-8"
          >
            {messages[msgIndex]}
          </motion.div>
        </AnimatePresence>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRipple}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl shadow-lg text-lg hover:from-green-500 hover:to-blue-600 transition relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            Accéder au Marketplace
          </button>
          <button
            onClick={handleRipple}
            className="w-full py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold rounded-xl shadow-lg text-lg hover:from-red-500 hover:to-pink-600 transition relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-pink-400"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            Se déconnecter
          </button>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">© {new Date().getFullYear()} Etlecktik. Tous droits réservés.</div>
      </motion.div>
      <style jsx global>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background-color: rgba(124, 58, 237, 0.3);
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