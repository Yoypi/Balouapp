import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

const bgImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80',
  'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1500&q=80',
];

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const router = useRouter();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('isLogged') === 'true') {
      router.replace('/dashboard');
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const validateEmail = (email) => /.+@.+\..+/.test(email);

  // Effet ripple sur le bouton
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Adresse e-mail invalide');
      return;
    }
    if (password.length < 6) {
      setError('Mot de passe trop court');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Connexion spéciale pour Belahsen
      if (email.trim().toLowerCase() === 'balou@gmail.com' && password === 'BALOU2029') {
        localStorage.setItem('isLogged', 'true');
        localStorage.setItem('currentUser', 'balou@gmail.com');
        setLoading(false);
        router.replace('/profile');
        return;
      }
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === btoa(password));
      if (!user) {
        setError('Identifiants incorrects');
        setLoading(false);
        return;
      }
      setLoading(false);
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('currentUser', user.email);
      router.replace('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Head>
        <title>Connexion | Walk & Earn</title>
      </Head>
      {/* Background dynamique */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
        />
      </AnimatePresence>
      {/* Overlay de flou et de couleur */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/60 to-blue-700/60 backdrop-blur-[4px] z-10" />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-20 w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-xl border border-white/40"
      >
        {/* Logo animé */}
        <motion.div
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="flex flex-col items-center mb-6"
        >
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
            alt="Logo"
            className="w-16 h-16 mb-2 drop-shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1 tracking-tight">Walk & Earn</h1>
          <p className="text-gray-600 text-center text-sm">Par l'entreprise <span className="font-bold text-purple-700">Etlecktik</span></p>
        </motion.div>
        <div className="mb-6 text-center">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow font-semibold text-sm animate-pulse">Chaque pas compte pour tes récompenses !</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/><path d="M12 14v7m0 0H7m5 0h5"/></svg>
            </span>
            <input
              type="email"
              required
              placeholder="Adresse e-mail"
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm bg-white/80 transition-all duration-200 focus:border-purple-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17a5 5 0 0 0 5-5V9a5 5 0 0 0-10 0v3a5 5 0 0 0 5 5Z"/><path d="M17 13v-2a5 5 0 0 0-10 0v2"/></svg>
            </span>
            <input
              type="password"
              required
              placeholder="Mot de passe"
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white/80 transition-all duration-200 focus:border-purple-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            ref={buttonRef}
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 transition disabled:opacity-60 flex items-center justify-center relative overflow-hidden ripple-btn"
            disabled={loading}
            onClick={handleRipple}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {loading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-4"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-4 border-white border-t-purple-600 rounded-full inline-block align-middle"
                  style={{ borderTopColor: '#7c3aed' }}
                />
              </motion.span>
            )}
            <span className="ml-2">{loading ? 'Connexion...' : 'Se connecter'}</span>
          </motion.button>
        </form>
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <a href="#" className="hover:underline">Mot de passe oublié ?</a>
          <Link href="/register" className="hover:underline">Créer un compte</Link>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} Etlecktik. Tous droits réservés.</div>
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