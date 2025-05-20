import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const gifts = [
  { name: 'Carte Amazon 10€', points: 100, img: 'https://cdn-icons-png.flaticon.com/512/5968/5968525.png', badge: 'Nouveau', stock: 5 },
  { name: 'Casque Bluetooth', points: 350, img: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png', badge: 'Populaire', stock: 2 },
  { name: 'Bon Starbucks', points: 80, img: 'https://cdn-icons-png.flaticon.com/512/732/732217.png', badge: '', stock: 10 },
  { name: 'T-shirt Etlecktik', points: 200, img: 'https://cdn-icons-png.flaticon.com/512/892/892458.png', badge: 'Exclu', stock: 1 },
  { name: 'Carte Netflix 15€', points: 180, img: 'https://cdn-icons-png.flaticon.com/512/732/732228.png', badge: '', stock: 3 },
  { name: 'Gourde connectée', points: 120, img: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png', badge: '', stock: 7 },
];

export default function Marketplace() {
  const [user, setUser] = useState({ email: '', points: 0 });
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [displayedGifts, setDisplayedGifts] = useState(gifts);
  const [flyingPoints, setFlyingPoints] = useState(null);
  const [globalStats, setGlobalStats] = useState({ users: 0, totalPoints: 0, exchanges: 0 });
  const [motivation, setMotivation] = useState('');
  const messages = [
    "Échange tes points, fais-toi plaisir !",
    "Les meilleures récompenses sont pour les plus actifs !",
    "Chaque point compte, continue à marcher !",
    "Etlecktik, la motivation au bout des pieds !"
  ];
  const router = useRouter();
  const pointsRef = useRef();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('isLogged') !== 'true') {
      router.replace('/');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const email = localStorage.getItem('currentUser');
    const u = users.find(u => u.email === email);
    setUser(u || { email: '', points: 0 });
  }, []);

  useEffect(() => {
    let filtered = gifts.filter(gift =>
      gift.name.toLowerCase().includes(search.toLowerCase())
    );
    if (filter === 'low') filtered = filtered.sort((a, b) => a.points - b.points);
    if (filter === 'high') filtered = filtered.sort((a, b) => b.points - a.points);
    if (filter === 'stock') filtered = filtered.sort((a, b) => b.stock - a.stock);
    setDisplayedGifts(filtered);
  }, [search, filter]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const totalPoints = users.reduce((acc, u) => acc + (u.points || 0), 0);
    setGlobalStats({ users: users.length, totalPoints, exchanges: 42 }); // exchanges fictif
    setMotivation(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const handleExchange = (gift, idx) => {
    if (user.points < gift.points) {
      setFeedback({ show: true, type: 'error', message: "Pas assez de points pour cette récompense." });
      return;
    }
    if (gift.stock <= 0) {
      setFeedback({ show: true, type: 'error', message: "Rupture de stock pour cette récompense." });
      return;
    }
    // Animation points qui volent
    setFlyingPoints({ idx, points: gift.points });
    setTimeout(() => {
      // Décrémente les points et le stock
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const idxUser = users.findIndex(u => u.email === user.email);
      users[idxUser].points = (users[idxUser].points || 0) - gift.points;
      localStorage.setItem('users', JSON.stringify(users));
      setUser({ ...user, points: users[idxUser].points });
      setFeedback({ show: true, type: 'success', message: `Bravo ! Tu as échangé ${gift.points} points contre ${gift.name}` });
      setFlyingPoints(null);
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 relative overflow-hidden">
      <Head>
        <title>Marketplace | Etlecktik</title>
      </Head>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-20 w-full max-w-5xl p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-2xl border border-white/40"
      >
        <div className="flex flex-col items-center mb-6">
          <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Logo" className="w-20 h-20 mb-2 drop-shadow-lg animate-bounce" />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1 tracking-tight">Marketplace</h1>
          <p className="text-purple-700 text-center text-lg font-semibold mb-2">Etlecktik</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 w-full">
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Rechercher une récompense..."
              className="px-4 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white/80 shadow"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Rechercher une récompense"
            />
            <select
              className="px-3 py-2 rounded-lg border border-purple-300 bg-white/80 shadow focus:ring-2 focus:ring-purple-500"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              aria-label="Filtrer les récompenses"
            >
              <option value="all">Tri par défaut</option>
              <option value="low">Prix croissant</option>
              <option value="high">Prix décroissant</option>
              <option value="stock">Stock</option>
            </select>
          </div>
          <div ref={pointsRef} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-xl shadow font-bold text-lg flex items-center gap-2">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {user.points || 0} points restants
          </div>
          <a href="/dashboard" className="text-blue-700 font-semibold hover:underline transition">← Retour au tableau de bord</a>
        </div>
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl shadow font-bold text-lg flex items-center gap-2">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {globalStats.users} utilisateurs
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-xl shadow font-bold text-lg flex items-center gap-2">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {globalStats.totalPoints} points cumulés
            </div>
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white px-6 py-2 rounded-xl shadow font-bold text-lg flex items-center gap-2">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {globalStats.exchanges} échanges
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-xl font-bold text-purple-700 animate-pulse">{motivation}</motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {displayedGifts.map((gift, idx) => (
            <motion.div
              key={gift.name}
              whileHover={{ scale: 1.07, boxShadow: '0 8px 32px 0 rgba(124,58,237,0.25)' }}
              className="relative flex flex-col items-center bg-gradient-to-br from-blue-200/70 to-purple-200/80 rounded-2xl p-6 shadow-xl border-2 border-white/40 backdrop-blur-xl"
            >
              {gift.badge && (
                <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs px-3 py-1 rounded-full shadow font-bold animate-pulse">{gift.badge}</span>
              )}
              <img src={gift.img} alt={gift.name} className="w-16 h-16 mb-2" />
              <span className="font-bold text-lg text-gray-800 mb-1 text-center">{gift.name}</span>
              <span className="text-purple-700 font-semibold mb-2">{gift.points} points</span>
              <span className="text-xs text-gray-500 mb-2">Stock : {gift.stock > 0 ? gift.stock : 'Rupture'}</span>
              <button
                onClick={() => handleExchange(gift, idx)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                disabled={gift.stock <= 0 || user.points < gift.points}
                aria-label={`Échanger contre ${gift.name}`}
              >
                Échanger
              </button>
              {/* Animation points qui volent */}
              <AnimatePresence>
                {flyingPoints && flyingPoints.idx === idx && (
                  <motion.div
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -80, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9 }}
                    className="absolute left-1/2 -translate-x-1/2 top-8 text-yellow-500 font-bold text-lg pointer-events-none select-none"
                  >
                    -{flyingPoints.points} pts
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {feedback.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className={`fixed left-1/2 -translate-x-1/2 bottom-8 px-6 py-3 rounded-xl shadow-xl text-white font-bold z-50 ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
              onAnimationEnd={() => setTimeout(() => setFeedback({ ...feedback, show: false }), 2000)}
            >
              {feedback.type === 'success' && (
                <span className="mr-2">🎉</span>
              )}
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-8 text-center text-xs text-gray-500">© {new Date().getFullYear()} Etlecktik. Tous droits réservés.</div>
      </motion.div>
    </div>
  );
} 