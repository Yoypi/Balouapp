import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [slider, setSlider] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const sliderRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();

  // Validation
  const validateEmail = (email) => /.+@.+\..+/.test(email);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 6;
  const isConfirmValid = password === confirm && password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid && isConfirmValid && captcha;

  // Particules animées
  useEffect(() => {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Propriétés aléatoires
      const size = Math.random() * 15 + 5;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 15 + 10;
      
      // Appliquer les styles
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      container.appendChild(particle);
      
      // Supprimer après animation pour éviter une accumulation
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    };
    
    // Créer des particules initiales
    for (let i = 0; i < 20; i++) {
      createParticle();
    }
    
    // Ajouter de nouvelles particules périodiquement
    const interval = setInterval(() => {
      createParticle();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSlider = (e) => {
    const value = Number(e.target.value);
    setSlider(value);
    if (value === 100) setCaptcha(true);
    else setCaptcha(false);
  };

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!isFormValid) {
      setError("Merci de remplir correctement tous les champs et de valider le captcha.");
      return;
    }
    
    setLoading(true);

    // Simuler un délai de chargement pour démonstration
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Vérifie si l'email existe déjà
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        setError('Cet e-mail est déjà utilisé');
        setLoading(false);
        return;
      }

      // Ajoute le compte (avec encodage pour la démo)
      users.push({ 
        email, 
        password: btoa(password),
        createdAt: new Date().toISOString(),
        points: 0
      });
      
      localStorage.setItem('users', JSON.stringify(users));
      setSuccess(true);
      
      // Réinitialiser le formulaire
      setEmail('');
      setPassword('');
      setConfirm('');
      setSlider(0);
      setCaptcha(false);
      
      // Rediriger après quelques secondes
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      setError('Une erreur est survenue lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  // Avancer à l'étape suivante
  const nextStep = () => {
    if (step === 1 && !isEmailValid) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    if (step === 2 && !isPasswordValid) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (step === 2 && !isConfirmValid) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setError('');
    setStep(step + 1);
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 relative overflow-hidden">
      <Head>
        <title>Créer un compte | Etlecktik</title>
      </Head>
      
      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden particles-container">
        {/* Les particules seront ajoutées dynamiquement via JavaScript */}
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-20 w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-xl border border-white/40"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
            alt="Logo"
            className="w-20 h-20 mb-4 drop-shadow-xl"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">Créer un compte</h1>
          <p className="text-gray-600 text-center">Rejoignez l'aventure <span className="font-bold text-purple-700">Etlecktik</span></p>
          
          {/* Indicateur d'étape */}
          <div className="flex items-center justify-center mt-4 space-x-1">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full ${i === step ? 'bg-purple-600 w-8' : 'bg-gray-300 w-3'}`}
                animate={{ width: i === step ? 32 : 12 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Étape 1: Email */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-700 mb-2">Votre adresse email</h2>
                <p className="text-gray-500 text-sm mb-4">Nous utiliserons cette adresse pour vous connecter</p>
                
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 group-focus-within:text-purple-600 transition-colors">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
                      <path d="M12 14v7m0 0H7m5 0h5"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Adresse e-mail"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white/80 transition-all duration-200 ${
                      isEmailValid ? 'border-green-400' : 'border-gray-300'
                    }`}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading || success}
                  />
                  
                  {/* Indicateur de validation */}
                  {email && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isEmailValid ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {isEmailValid ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Étape 2: Mot de passe */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-700 mb-2">Créez un mot de passe sécurisé</h2>
                <p className="text-gray-500 text-sm mb-4">Utilisez au moins 6 caractères, avec des lettres et des chiffres</p>
                
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 group-focus-within:text-purple-600 transition-colors">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 17a5 5 0 0 0 5-5V9a5 5 0 0 0-10 0v3a5 5 0 0 0 5 5Z"/>
                      <path d="M17 13v-2a5 5 0 0 0-10 0v2"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Mot de passe (min. 6 caractères)"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white/80 transition-all duration-200 ${
                      isPasswordValid ? 'border-green-400' : 'border-gray-300'
                    }`}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading || success}
                  />
                  
                  {/* Indicateur de validation */}
                  {password && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isPasswordValid ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {isPasswordValid ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </motion.span>
                  )}
                </div>

                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 group-focus-within:text-purple-600 transition-colors">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 17a5 5 0 0 0 5-5V9a5 5 0 0 0-10 0v3a5 5 0 0 0 5 5Z"/>
                      <path d="M17 13v-2a5 5 0 0 0-10 0v2"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Confirmer le mot de passe"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white/80 transition-all duration-200 ${
                      isConfirmValid ? 'border-green-400' : 'border-gray-300'
                    }`}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    disabled={loading || success}
                  />
                  
                  {/* Indicateur de validation */}
                  {confirm && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isConfirmValid ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {isConfirmValid ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </motion.span>
                  )}
                </div>
                
                {/* Indicateur de sécurité du mot de passe */}
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Sécurité du mot de passe</span>
                      <span>
                        {password.length < 6 && 'Faible'}
                        {password.length >= 6 && password.length < 10 && 'Moyenne'}
                        {password.length >= 10 && 'Forte'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${
                          password.length < 6 
                            ? 'bg-red-500' 
                            : password.length < 10 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: password.length < 6 
                            ? '33%' 
                            : password.length < 10 
                            ? '66%' 
                            : '100%' 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Étape 3: Captcha et finalisation */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-700 mb-2">Vérification humaine</h2>
                <p className="text-gray-500 text-sm mb-4">Une dernière étape avant de créer votre compte</p>
                
                {/* Captcha amélioré */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-sm text-gray-600 mb-2 block">Faites glisser pour prouver que vous êtes humain</label>
                  <div className="relative">
                    <input
                      ref={sliderRef}
                      type="range"
                      min="0"
                      max="100"
                      value={slider}
                      onChange={handleSlider}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      disabled={loading || success}
                    />
                    <div className="w-full flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: captcha ? 1.1 : 1 }}
                    className={`mt-3 text-sm font-medium ${
                      captcha ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {captcha ? '✓ Captcha validé !' : 'Déplacez le curseur à 100%'}
                  </motion.div>
                </div>
                
                <div className="pt-2">
                  <label className="flex items-start gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="mt-0.5" />
                    <span>
                      J'accepte les <a href="#" className="text-purple-600 hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-purple-600 hover:underline">politique de confidentialité</a>
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200"
              >
                Compte créé avec succès ! <Link href="/" className="underline text-blue-600">Se connecter</Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between gap-4">
            {step > 1 && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl shadow hover:bg-gray-300 transition flex-1"
                disabled={loading || success}
              >
                Retour
              </motion.button>
            )}
            
            {step < 3 ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-600 transition flex-1"
                disabled={loading || success}
              >
                Suivant
              </motion.button>
            ) : (
              <motion.button
                ref={buttonRef}
                type="submit"
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  handleRipple(e);
                  if (!e.currentTarget.form) handleRegister(e);
                }}
                className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-600 transition disabled:opacity-60 flex items-center justify-center relative overflow-hidden flex-1 ${
                  isFormValid ? '' : 'opacity-60 cursor-not-allowed'
                }`}
                disabled={!isFormValid || loading || success}
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
                    />
                  </motion.span>
                )}
                <span className={loading ? 'ml-2' : ''}>
                  {loading ? 'Création en cours...' : 'Créer mon compte'}
                </span>
              </motion.button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-purple-700 transition-colors">
            Déjà un compte ? Se connecter
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Etlecktik. Tous droits réservés.
        </div>
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
        
        .particle {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: float linear infinite;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          75% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-150vh) translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 