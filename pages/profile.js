import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

// Données de logs étendues
const securityLogs = [
  { type: 'login', date: '2024-03-20 14:30', ip: '192.168.1.1', status: 'success', details: 'Connexion réussie' },
  { type: 'new_account', date: '2024-03-20 13:15', ip: '192.168.1.2', status: 'success', details: 'Nouveau compte: user@example.com' },
  { type: 'password_change', date: '2024-03-19 10:15', ip: '192.168.1.1', status: 'success', details: 'Mot de passe modifié' },
  { type: 'reward_creation', date: '2024-03-18 16:45', ip: '192.168.1.1', status: 'success', details: 'Nouvelle récompense créée: Carte Amazon 50€' },
  { type: 'points_adjustment', date: '2024-03-18 15:30', ip: '192.168.1.1', status: 'success', details: 'Ajustement de points: +500 pour user@example.com' },
  { type: 'security_alert', date: '2024-03-18 14:20', ip: '192.168.1.3', status: 'warning', details: 'Tentative de connexion suspecte' },
];

const rewards = [
  { name: 'Carte Amazon 50€', points: 500, status: 'active', created: '2024-03-15', createdBy: 'Belahsen Bouden' },
  { name: 'Casque Premium', points: 800, status: 'active', created: '2024-03-10', createdBy: 'Belahsen Bouden' },
  { name: 'Abonnement Spotify', points: 300, status: 'active', created: '2024-03-05', createdBy: 'Belahsen Bouden' },
];

// Nouveau composant pour les statistiques en temps réel
const LiveStats = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    newAccountsToday: 0,
    totalPoints: 0,
    securityAlerts: 0
  });

  useEffect(() => {
    // Simuler des mises à jour en temps réel
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        newAccountsToday: prev.newAccountsToday + Math.floor(Math.random() * 2),
        totalPoints: prev.totalPoints + Math.floor(Math.random() * 100),
        securityAlerts: prev.securityAlerts + Math.floor(Math.random() * 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl text-white"
      >
        <h4 className="text-sm font-semibold mb-1">Utilisateurs actifs</h4>
        <p className="text-2xl font-bold">{stats.activeUsers}</p>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl text-white"
      >
        <h4 className="text-sm font-semibold mb-1">Nouveaux comptes</h4>
        <p className="text-2xl font-bold">{stats.newAccountsToday}</p>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-yellow-500 to-orange-600 p-4 rounded-xl text-white"
      >
        <h4 className="text-sm font-semibold mb-1">Points totaux</h4>
        <p className="text-2xl font-bold">{stats.totalPoints}</p>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-xl text-white"
      >
        <h4 className="text-sm font-semibold mb-1">Alertes sécurité</h4>
        <p className="text-2xl font-bold">{stats.securityAlerts}</p>
      </motion.div>
    </div>
  );
};

export default function Profile() {
  const [user, setUser] = useState({
    email: '',
    points: 0,
    lastLogin: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });
  const [filterLogs, setFilterLogs] = useState('all');
  const [users, setUsers] = useState([]);
  const [logList, setLogList] = useState(securityLogs);
  const [newUser, setNewUser] = useState({ email: '', password: '', isAdmin: false });
  const router = useRouter();
  const fileInputRef = useRef();
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('isLogged') !== 'true') {
      router.replace('/');
      return;
    }
    const current = localStorage.getItem('currentUser');
    setCurrentUser(current);
    setIsAdmin(current === 'balou@gmail.com');
    if (current === 'balou@gmail.com') {
      setUser({
        email: 'balou@gmail.com',
        points: 2500,
        lastLogin: new Date().toLocaleString('fr-FR'),
      });
      setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const u = users.find(u => u.email === current);
      setUser(u || { email: current, points: 0, lastLogin: '' });
    }
  }, []);

  useEffect(() => {
    if (isAdmin && activeTab === 'users') {
      setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
    }
  }, [isAdmin, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('currentUser');
    router.replace('/');
  };

  const handleSecurityAction = (action) => {
    setFeedback({
      show: true,
      type: 'success',
      message: `Action de sécurité ${action} effectuée avec succès !`
    });
  };

  const handlePoints = (email, delta) => {
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, points: (u.points || 0) + delta };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    // Ajout d'un log dynamique
    const log = {
      type: 'points_adjustment',
      date: new Date().toLocaleString('fr-FR'),
      ip: 'admin',
      status: 'success',
      details: `${delta > 0 ? 'Ajout' : 'Retrait'} de ${Math.abs(delta)} points pour ${email}`
    };
    setLogList([log, ...logList]);
    setFeedback({ show: true, type: 'success', message: `Points mis à jour pour ${email}` });
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
  };

  const handleCreateUser = () => {
    if (!/.+@.+\..+/.test(newUser.email) || newUser.password.length < 6) {
      setFeedback({ show: true, type: 'error', message: 'Email ou mot de passe invalide.' });
      return;
    }
    const existing = users.find(u => u.email === newUser.email);
    if (existing) {
      setFeedback({ show: true, type: 'error', message: 'Cet email existe déjà.' });
      return;
    }
    const userObj = { email: newUser.email, password: btoa(newUser.password), points: 0, isAdmin: newUser.isAdmin };
    const updatedUsers = [...users, userObj];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setLogList([{ type: 'new_account', date: new Date().toLocaleString('fr-FR'), ip: 'admin', status: 'success', details: `Création du compte ${newUser.email} (${newUser.isAdmin ? 'admin' : 'user'})` }, ...logList]);
    setFeedback({ show: true, type: 'success', message: 'Compte créé !' });
    setNewUser({ email: '', password: '', isAdmin: false });
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
  };

  const handlePromote = (email, admin) => {
    const updatedUsers = users.map(u => u.email === email ? { ...u, isAdmin: admin } : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setLogList([{ type: 'role_change', date: new Date().toLocaleString('fr-FR'), ip: 'admin', status: 'success', details: `${email} est maintenant ${admin ? 'admin' : 'utilisateur'}` }, ...logList]);
    setFeedback({ show: true, type: 'success', message: `Rôle mis à jour pour ${email}` });
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
  };

  const handleDelete = (email) => {
    const updatedUsers = users.filter(u => u.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setLogList([{ type: 'delete_account', date: new Date().toLocaleString('fr-FR'), ip: 'admin', status: 'success', details: `Suppression du compte ${email}` }, ...logList]);
    setFeedback({ show: true, type: 'success', message: `Compte supprimé : ${email}` });
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
  };

  const handleResetPassword = (email) => {
    const newPass = Math.random().toString(36).slice(-8);
    const updatedUsers = users.map(u => u.email === email ? { ...u, password: btoa(newPass) } : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setLogList([{ type: 'reset_password', date: new Date().toLocaleString('fr-FR'), ip: 'admin', status: 'success', details: `Reset du mot de passe pour ${email}` }, ...logList]);
    setFeedback({ show: true, type: 'success', message: `Nouveau mot de passe pour ${email} : ${newPass}` });
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
  };

  const handleExport = () => {
    const data = JSON.stringify(users, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'etlecktik-comptes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setFeedback({ show: true, type: 'success', message: 'Export des comptes réussi !' });
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (!Array.isArray(imported)) throw new Error('Format invalide');
        setUsers(imported);
        localStorage.setItem('users', JSON.stringify(imported));
        setLogList([{ type: 'import_accounts', date: new Date().toLocaleString('fr-FR'), ip: 'admin', status: 'success', details: `Import de ${imported.length} comptes` }, ...logList]);
        setFeedback({ show: true, type: 'success', message: 'Import réussi !' });
        setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
      } catch {
        setFeedback({ show: true, type: 'error', message: 'Erreur lors de l\'import.' });
      }
    };
    reader.readAsText(file);
  };

  const filteredLogs = logList.filter(log => {
    if (filterLogs === 'all') return true;
    return log.type === filterLogs;
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 relative overflow-hidden">
      <Head>
        <title>Profil Admin | Etlecktik</title>
      </Head>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-20 w-full max-w-6xl p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-2xl border border-white/40"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
              alt="Logo"
              className="w-24 h-24 mb-4 drop-shadow-xl animate-bounce"
            />
            {isAdmin && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Admin
              </div>
            )}
          </motion.div>
          {isAdmin ? (
            <>
              <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">Belahsen Bouden</h1>
              <p className="text-purple-700 text-xl font-semibold mb-4">Co-fondateur - Etlecktik</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">{user.email}</h1>
            </>
          )}
          <div className="flex gap-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-xl shadow font-bold text-lg flex items-center gap-2">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {user.points} points
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-xl shadow font-bold text-lg flex items-center gap-2">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Niveau de sécurité : {user.securityLevel}
            </div>
          </div>
        </div>

        <LiveStats />

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              activeTab === 'security'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sécurité
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              activeTab === 'rewards'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Récompenses
          </button>
          {/* Onglet Utilisateurs visible uniquement pour Belahsen */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-xl font-semibold transition ${activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Utilisateurs
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-blue-400 p-6 rounded-2xl text-white">
                  <h3 className="text-xl font-bold mb-4">Statistiques</h3>
                  <div className="space-y-2">
                    <p>Dernière connexion : {user.lastLogin}</p>
                    <p>Points gagnés ce mois : 1250</p>
                    <p>Récompenses créées : {rewards.length}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl text-white">
                  <h3 className="text-xl font-bold mb-4">Actions rapides</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSecurityAction('2FA')}
                      className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Activer 2FA
                    </button>
                    <button
                      onClick={() => handleSecurityAction('password')}
                      className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Changer mot de passe
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setFilterLogs('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filterLogs === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterLogs('new_account')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filterLogs === 'new_account'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Nouveaux comptes
                </button>
                <button
                  onClick={() => setFilterLogs('security_alert')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filterLogs === 'security_alert'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Alertes
                </button>
              </div>
              <div className="bg-white/90 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Journal de sécurité</h3>
                <div className="space-y-4">
                  {filteredLogs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{log.type}</p>
                        <p className="text-sm text-gray-500">{log.date}</p>
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{log.ip}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          log.status === 'success' ? 'bg-green-100 text-green-800' : 
                          log.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-purple-500 to-blue-400 p-6 rounded-2xl text-white"
                  >
                    <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
                    <p className="text-2xl font-bold mb-2">{reward.points} points</p>
                    <p className="text-sm opacity-80">Créé le {reward.created}</p>
                    <p className="text-sm opacity-80">Par {reward.createdBy}</p>
                    <div className="mt-4">
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                        {reward.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && isAdmin && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-4 mb-6">
                <button onClick={handleExport} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow font-semibold">Exporter comptes</button>
                <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow font-semibold">Importer comptes</button>
                <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
              </div>
              <div className="bg-white/90 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Créer un compte</h3>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="px-4 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white/80 shadow" />
                  <input type="password" placeholder="Mot de passe" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="px-4 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white/80 shadow" />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newUser.isAdmin} onChange={e => setNewUser({ ...newUser, isAdmin: e.target.checked })} />
                    <span className="text-sm">Admin</span>
                  </label>
                  <button onClick={handleCreateUser} className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow font-semibold">Créer</button>
                </div>
              </div>
              <div className="bg-white/90 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Gestion des utilisateurs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Points</th>
                        <th className="px-4 py-2">Rôle</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, idx) => (
                        <tr key={u.email} className="border-b">
                          <td className="px-4 py-2">{u.email}</td>
                          <td className="px-4 py-2">{u.points || 0}</td>
                          <td className="px-4 py-2">{u.isAdmin ? <span className="text-green-600 font-bold">Admin</span> : 'Utilisateur'}</td>
                          <td className="px-4 py-2 flex flex-wrap gap-2">
                            {u.email !== 'balou@gmail.com' && (
                              <>
                                <button onClick={() => handlePromote(u.email, !u.isAdmin)} className={`px-2 py-1 rounded ${u.isAdmin ? 'bg-yellow-500' : 'bg-green-500'} text-white hover:bg-opacity-80`}>{u.isAdmin ? 'Rétrograder' : 'Promouvoir admin'}</button>
                                <button onClick={() => handleDelete(u.email)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Supprimer</button>
                                <button onClick={() => handleResetPassword(u.email)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Reset MDP</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-purple-700 font-semibold hover:underline transition"
          >
            ← Retour au tableau de bord
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition"
          >
            Se déconnecter
          </button>
        </div>

        <AnimatePresence>
          {feedback.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className={`fixed left-1/2 -translate-x-1/2 bottom-8 px-6 py-3 rounded-xl shadow-xl text-white font-bold z-50 ${
                feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
              onAnimationEnd={() => setTimeout(() => setFeedback({ ...feedback, show: false }), 2000)}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Etlecktik. Tous droits réservés.
        </div>
      </motion.div>
    </div>
  );
} 