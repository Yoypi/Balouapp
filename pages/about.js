import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 relative overflow-hidden">
      <Head>
        <title>À propos | Etlecktik</title>
      </Head>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-20 w-full max-w-2xl p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-xl border border-white/40"
      >
        <div className="flex flex-col items-center mb-6">
          <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Logo" className="w-20 h-20 mb-2 drop-shadow-lg animate-bounce" />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1 tracking-tight">À propos d'Etlecktik</h1>
          <p className="text-purple-700 text-center text-lg font-semibold mb-2">L'innovation au service de ta motivation !</p>
        </div>
        <div className="mb-6 text-gray-700 text-center text-lg">
          <p>Etlecktik, c'est l'entreprise qui te motive à bouger chaque jour, à transformer tes pas en cadeaux, et à rendre ta vie plus fun et plus saine !</p>
          <p className="mt-4">Notre mission : <span className="font-bold text-blue-700">récompenser chaque effort</span> et t'accompagner vers une vie plus active, tout en te faisant plaisir.</p>
        </div>
        <div className="mb-6 text-center">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow font-semibold text-sm animate-pulse">#MoveWithEtlecktik</span>
        </div>
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="text-gray-500 font-semibold">Retrouve-nous sur :</span>
          <div className="flex gap-4 mt-2">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" className="w-8 h-8" /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" className="w-8 h-8" /></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" className="w-8 h-8" /></a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">© {new Date().getFullYear()} Etlecktik. Tous droits réservés.</div>
      </motion.div>
    </div>
  );
} 