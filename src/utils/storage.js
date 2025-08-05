/**
 * Utilitaires pour la gestion du localStorage
 * Gère la persistance des tâches et des paramètres utilisateur
 */

const STORAGE_KEYS = {
  TASKS: 'studytrack_tasks',
  SETTINGS: 'studytrack_settings',
  SUBJECTS: 'studytrack_subjects'
};

// Matières prédéfinies avec leurs couleurs
export const SUBJECTS = {
  'droit-civil': { name: 'Droit civil', color: '#3b82f6' },
  'droit-penal': { name: 'Droit pénal', color: '#10b981' },
  'droit-administratif': { name: 'Droit administratif', color: '#8b5cf6' },
  'droit-constitutionnel': { name: 'Droit constitutionnel', color: '#f59e0b' },
  'droit-commercial': { name: 'Droit commercial', color: '#ef4444' },
  'autres': { name: 'Autres', color: '#6b7280' }
};

// Niveaux de difficulté
export const DIFFICULTY_LEVELS = {
  'facile': { name: 'Facile', color: '#10b981', value: 1 },
  'moyen': { name: 'Moyen', color: '#f59e0b', value: 2 },
  'difficile': { name: 'Difficile', color: '#ef4444', value: 3 }
};

/**
 * Génère un ID unique pour les tâches
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Formate une date au format YYYY-MM-DD
 */
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Parse une date depuis le format YYYY-MM-DD
 */
export const parseDate = (dateString) => {
  return new Date(dateString + 'T00:00:00');
};

/**
 * Ajoute des jours à une date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Vérifie si une date est aujourd'hui
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = typeof date === 'string' ? parseDate(date) : date;
  return formatDate(today) === formatDate(checkDate);
};

/**
 * Vérifie si une date est dans le passé
 */
export const isPast = (date) => {
  const today = new Date();
  const checkDate = typeof date === 'string' ? parseDate(date) : date;
  return checkDate < today;
};

/**
 * Sauvegarde les données dans le localStorage
 */
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

/**
 * Récupère les données du localStorage
 */
const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return defaultValue;
  }
};

/**
 * Récupère toutes les tâches
 */
export const getTasks = () => {
  return getFromStorage(STORAGE_KEYS.TASKS, []);
};

/**
 * Sauvegarde toutes les tâches
 */
export const saveTasks = (tasks) => {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
};

/**
 * Ajoute une nouvelle tâche
 */
export const addTask = (taskData) => {
  const tasks = getTasks();
  const newTask = {
    id: generateId(),
    ...taskData,
    createdAt: new Date().toISOString(),
    completed: false
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

/**
 * Met à jour une tâche existante
 */
export const updateTask = (taskId, updates) => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    saveTasks(tasks);
    return tasks[taskIndex];
  }
  
  return null;
};

/**
 * Supprime une tâche
 */
export const deleteTask = (taskId) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(filteredTasks);
};

/**
 * Marque une tâche comme terminée et programme les répétitions
 */
export const completeTask = (taskId) => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;
  
  // Marque la tâche comme terminée
  updateTask(taskId, { completed: true, completedAt: new Date().toISOString() });
  
  // Programme les répétitions à J+1, J+3, J+7
  const baseDate = new Date();
  const repetitionDays = [1, 3, 7];
  
  repetitionDays.forEach(days => {
    const futureDate = addDays(baseDate, days);
    const repetitionTask = {
      title: task.title,
      subject: task.subject,
      difficulty: task.difficulty,
      date: formatDate(futureDate),
      originalTaskId: task.id,
      repetitionNumber: days,
      isRepetition: true
    };
    
    addTask(repetitionTask);
  });
};

/**
 * Récupère les tâches d'une date spécifique
 */
export const getTasksByDate = (date) => {
  const tasks = getTasks();
  const dateString = typeof date === 'string' ? date : formatDate(date);
  
  return tasks.filter(task => 
    task.date === dateString && !task.completed
  );
};

/**
 * Récupère les tâches du jour
 */
export const getTodayTasks = () => {
  const today = formatDate(new Date());
  return getTasksByDate(today);
};

/**
 * Récupère les tâches d'un mois spécifique
 */
export const getTasksByMonth = (year, month) => {
  const tasks = getTasks();
  const monthString = `${year}-${String(month).padStart(2, '0')}`;
  
  return tasks.filter(task => 
    task.date.startsWith(monthString) && !task.completed
  );
};

/**
 * Récupère les paramètres utilisateur
 */
export const getSettings = () => {
  return getFromStorage(STORAGE_KEYS.SETTINGS, {
    darkMode: false,
    sortBy: 'date', // 'date', 'subject', 'difficulty'
    sortOrder: 'asc' // 'asc', 'desc'
  });
};

/**
 * Sauvegarde les paramètres utilisateur
 */
export const saveSettings = (settings) => {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
};

/**
 * Bascule le mode sombre
 */
export const toggleDarkMode = () => {
  const settings = getSettings();
  const newSettings = { ...settings, darkMode: !settings.darkMode };
  saveSettings(newSettings);
  
  // Applique le thème immédiatement
  document.documentElement.setAttribute(
    'data-theme', 
    newSettings.darkMode ? 'dark' : 'light'
  );
  
  return newSettings.darkMode;
};

/**
 * Initialise les paramètres au chargement de l'application
 */
export const initializeSettings = () => {
  const settings = getSettings();
  document.documentElement.setAttribute(
    'data-theme', 
    settings.darkMode ? 'dark' : 'light'
  );
  return settings;
};

/**
 * Statistiques des tâches
 */
export const getTaskStats = () => {
  const tasks = getTasks();
  const completedTasks = tasks.filter(task => task.completed);
  const todayTasks = getTodayTasks();
  
  return {
    total: tasks.length,
    completed: completedTasks.length,
    pending: tasks.length - completedTasks.length,
    today: todayTasks.length,
    completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0
  };
};

/**
 * Exporte toutes les données pour sauvegarde
 */
export const exportData = () => {
  return {
    tasks: getTasks(),
    settings: getSettings(),
    exportDate: new Date().toISOString()
  };
};

/**
 * Importe des données depuis une sauvegarde
 */
export const importData = (data) => {
  try {
    if (data.tasks) saveTasks(data.tasks);
    if (data.settings) saveSettings(data.settings);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return false;
  }
};