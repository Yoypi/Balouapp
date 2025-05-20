import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(1);
  const router = useRouter();
  const buttonRef = useRef(null);

  // Images de fond
  const backgroundImages = [
    "https://images.unsplash.com/photo-1526401485004-46910ecc8e51",
    "https://images.unsplash.com/photo-1434754205268-ad3b5f549b11",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5"
  ];

  useEffect(() => {
    // Changer l'image de fond toutes les 20 secondes
    const interval = setInterval(() => {
      setBackgroundImage((prev) => (prev + 1) % backgroundImages.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Effet de ripple sur les boutons
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simuler un délai pour montrer le chargement
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      if (email === 'balou@gmail.com' && password === 'BALOU2029') {
        // Admin login pour la démo
        localStorage.setItem('isLogged', 'true');
        localStorage.setItem('currentUser', email);
        router.push('/dashboard');
      } else {
        // Vérifier les autres utilisateurs
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && atob(u.password) === password);
        
        if (user) {
          localStorage.setItem('isLogged', 'true');
          localStorage.setItem('currentUser', email);
          router.push('/dashboard');
        } else {
          setError('Email ou mot de passe incorrect.');
        }
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Head>
        <title>Connexion | Etlecktik</title>
      </Head>
      
      {/* Fond animé avec transitions douces */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((img, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img}?auto=format&fit=crop&w=1920&q=80)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === backgroundImage ? 0.6 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90" />
      </div>
      
      {/* Particules animées */}
      <div className="absolute inset-0 z-10 overflow-hidden">
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
      
      {/* Conteneur principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-6 text-white text-center">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
            alt="Logo"
            className="w-20 h-20 mx-auto mb-4"
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          <h1 className="text-3xl font-bold mb-1">Etlecktik</h1>
          <p className="text-purple-100">Entrez vos identifiants pour vous connecter</p>
        </div>
        
        {/* Formulaire */}
        <div className="bg-white/90 backdrop-blur-xl px-8 pt-6 pb-8">
          <form onSubmit={handleLogin}>
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 bg-white/80"
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mb-6 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-semibold" htmlFor="password">
                  Mot de passe
                </label>
                <a className="text-xs text-purple-600 hover:text-purple-800 transition-colors" href="#">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 bg-white/80"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="ml-2 block text-sm text-gray-700" htmlFor="remember">
                Rester connecté
              </label>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 py-3 px-4 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mb-6">
              <motion.button
                ref={buttonRef}
                type="submit"
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                onClick={handleRipple}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-xl shadow hover:shadow-lg transition-all duration-200 relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"
                    />
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </motion.button>
            </div>
          </form>
          
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-300 flex-grow"></div>
            <div className="mx-4 text-sm text-gray-500">ou</div>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <motion.button
              whileHover={{ y: -3 }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#4267B2">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="#4285F4" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="#000000" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Pied de page */}
        <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            Nouveau sur Etlecktik ? <Link href="/register" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">Créer un compte</Link>
          </p>
        </div>
      </motion.div>
      
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