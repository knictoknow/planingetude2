import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckSquare, Moon, Sun, BarChart3 } from 'lucide-react';
import TodoList from './components/TodoList.jsx';
import Calendar from './components/Calendar.jsx';
import './components/TodoList.css';
import './components/Calendar.css';
import './App.css';
import { 
  initializeSettings, 
  toggleDarkMode, 
  getTaskStats,
  addTask,
  SUBJECTS,
  DIFFICULTY_LEVELS,
  formatDate
} from './utils/storage.js';

/**
 * Composant principal de l'application StudyTrack
 * Gère la navigation entre les vues et les paramètres globaux
 */
function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stats, setStats] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialise l'application
  useEffect(() => {
    const settings = initializeSettings();
    setIsDarkMode(settings.darkMode);
    loadStats();
    
    // Ajoute des tâches d'exemple si c'est la première visite
    initializeSampleData();
  }, []);

  // Met à jour les stats quand les données changent
  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  // Charge les statistiques
  const loadStats = () => {
    const taskStats = getTaskStats();
    setStats(taskStats);
  };

  // Gère le changement de thème
  const handleThemeToggle = () => {
    const newDarkMode = toggleDarkMode();
    setIsDarkMode(newDarkMode);
  };

  // Force le rafraîchissement des données
  const handleDataUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Initialise des données d'exemple pour la démo
  const initializeSampleData = () => {
    const existingTasks = JSON.parse(localStorage.getItem('studytrack_tasks') || '[]');
    
    if (existingTasks.length === 0) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const sampleTasks = [
        {
          title: 'Réviser les contrats en droit civil',
          subject: 'droit-civil',
          difficulty: 'moyen',
          date: formatDate(today)
        },
        {
          title: 'Étudier les infractions pénales',
          subject: 'droit-penal',
          difficulty: 'difficile',
          date: formatDate(today)
        },
        {
          title: 'Lire le chapitre sur les libertés publiques',
          subject: 'droit-constitutionnel',
          difficulty: 'facile',
          date: formatDate(tomorrow)
        },
        {
          title: 'Réviser les actes administratifs',
          subject: 'droit-administratif',
          difficulty: 'moyen',
          date: formatDate(tomorrow)
        }
      ];
      
      sampleTasks.forEach(task => addTask(task));
      handleDataUpdate();
    }
  };

  // Définition des onglets
  const tabs = [
    {
      id: 'today',
      label: 'Aujourd\'hui',
      icon: CheckSquare,
      component: TodoList
    },
    {
      id: 'calendar',
      label: 'Calendrier',
      icon: CalendarIcon,
      component: Calendar
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="app">
      {/* En-tête de l'application */}
      <header className="app-header">
        <div className="container">
          <div className="app-header__content">
            {/* Logo et titre */}
            <div className="app-header__brand">
              <div className="app-logo">
                <CheckSquare size={28} />
              </div>
              <div className="app-brand-text">
                <h1>StudyTrack</h1>
                <p>Système de révision espacée pour le droit</p>
              </div>
            </div>

            {/* Statistiques */}
            <div className="app-header__stats">
              <div className="stat-item">
                <BarChart3 size={16} />
                <span className="stat-value">{stats.today || 0}</span>
                <span className="stat-label">Aujourd'hui</span>
              </div>
              <div className="stat-item">
                <CheckSquare size={16} />
                <span className="stat-value">{stats.completed || 0}</span>
                <span className="stat-label">Terminées</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{Math.round(stats.completionRate || 0)}%</span>
                <span className="stat-label">Taux</span>
              </div>
            </div>

            {/* Actions */}
            <div className="app-header__actions">
              <button
                className="btn btn-secondary theme-toggle"
                onClick={handleThemeToggle}
                title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation principale */}
      <nav className="app-nav">
        <div className="container">
          <div className="app-nav__tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`app-nav__tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="app-main">
        <div className="container">
          <div className="app-content">
            {ActiveComponent && (
              <ActiveComponent 
                key={activeTab + refreshKey}
                onTaskUpdate={handleDataUpdate}
              />
            )}
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="app-footer">
        <div className="container">
          <div className="app-footer__content">
            <p>
              StudyTrack - Révision espacée pour vos études de droit
            </p>
            <div className="app-footer__links">
              <span>Répétition automatique : J+1, J+3, J+7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;