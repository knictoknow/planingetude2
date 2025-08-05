import React, { useState, useEffect } from 'react';
import { Plus, SortAsc, SortDesc, Filter, Search } from 'lucide-react';
import TaskItem from './TaskItem.jsx';
import AddTaskModal from './AddTaskModal.jsx';
import './TaskItem.css';
import { 
  getTodayTasks, 
  completeTask, 
  SUBJECTS, 
  DIFFICULTY_LEVELS,
  getSettings,
  saveSettings
} from '../utils/storage.js';

/**
 * Composant principal pour afficher et gérer la liste des tâches du jour
 * Inclut les fonctionnalités de tri, filtrage et ajout de nouvelles tâches
 */
const TodoList = ({ onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Charge les tâches du jour et les paramètres de tri
  useEffect(() => {
    loadTasks();
    loadSettings();
  }, []);

  // Met à jour les tâches filtrées quand les critères changent
  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, sortBy, sortOrder, filterSubject, filterDifficulty, searchQuery]);

  // Charge les tâches du jour
  const loadTasks = () => {
    const todayTasks = getTodayTasks();
    setTasks(todayTasks);
  };

  // Charge les paramètres de tri sauvegardés
  const loadSettings = () => {
    const settings = getSettings();
    setSortBy(settings.sortBy || 'date');
    setSortOrder(settings.sortOrder || 'asc');
  };

  // Sauvegarde les paramètres de tri
  const saveCurrentSettings = (newSortBy, newSortOrder) => {
    const settings = getSettings();
    saveSettings({
      ...settings,
      sortBy: newSortBy,
      sortOrder: newSortOrder
    });
  };

  // Applique les filtres et le tri
  const applyFiltersAndSort = () => {
    let filtered = [...tasks];

    // Filtre par matière
    if (filterSubject !== 'all') {
      filtered = filtered.filter(task => task.subject === filterSubject);
    }

    // Filtre par difficulté
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(task => task.difficulty === filterDifficulty);
    }

    // Filtre par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        SUBJECTS[task.subject]?.name.toLowerCase().includes(query)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'subject':
          comparison = SUBJECTS[a.subject].name.localeCompare(SUBJECTS[b.subject].name);
          break;
        case 'difficulty':
          comparison = DIFFICULTY_LEVELS[a.difficulty].value - DIFFICULTY_LEVELS[b.difficulty].value;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
        default:
          comparison = new Date(a.date) - new Date(b.date);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredTasks(filtered);
  };

  // Gère le changement de tri
  const handleSortChange = (newSortBy) => {
    let newSortOrder = 'asc';
    
    if (sortBy === newSortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    saveCurrentSettings(newSortBy, newSortOrder);
  };

  // Gère la completion d'une tâche
  const handleCompleteTask = async (taskId) => {
    try {
      // Animation de sortie
      const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskElement) {
        taskElement.classList.add('task-item--completing');
      }

      // Délai pour l'animation
      setTimeout(() => {
        completeTask(taskId);
        loadTasks();
        
        // Notifie le parent du changement
        if (onTaskUpdate) {
          onTaskUpdate();
        }
      }, 300);
    } catch (error) {
      console.error('Erreur lors de la completion de la tâche:', error);
    }
  };

  // Gère l'ajout d'une nouvelle tâche
  const handleAddTask = () => {
    loadTasks();
    setIsAddModalOpen(false);
    
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  };

  // Reset tous les filtres
  const resetFilters = () => {
    setFilterSubject('all');
    setFilterDifficulty('all');
    setSearchQuery('');
  };

  // Compte les filtres actifs
  const activeFiltersCount = [
    filterSubject !== 'all',
    filterDifficulty !== 'all',
    searchQuery.trim()
  ].filter(Boolean).length;

  return (
    <div className="todo-list">
      {/* En-tête */}
      <div className="todo-list__header">
        <div className="todo-list__title">
          <h2>Tâches du jour</h2>
          <span className="todo-list__count">
            {filteredTasks.length} tâche{filteredTasks.length !== 1 ? 's' : ''}
            {tasks.length !== filteredTasks.length && ` sur ${tasks.length}`}
          </span>
        </div>

        <div className="todo-list__actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
            title="Filtres et tri"
          >
            <Filter size={16} />
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
            title="Ajouter une tâche"
          >
            <Plus size={16} />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Panneau de filtres */}
      {showFilters && (
        <div className="todo-list__filters">
          {/* Barre de recherche */}
          <div className="filter-group">
            <label>Rechercher</label>
            <div className="search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Titre ou matière..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="filter-group">
            <label>Matière</label>
            <select 
              value={filterSubject} 
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="all">Toutes les matières</option>
              {Object.entries(SUBJECTS).map(([key, subject]) => (
                <option key={key} value={key}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulté</label>
            <select 
              value={filterDifficulty} 
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="all">Toutes les difficultés</option>
              {Object.entries(DIFFICULTY_LEVELS).map(([key, difficulty]) => (
                <option key={key} value={key}>{difficulty.name}</option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div className="filter-group">
            <label>Trier par</label>
            <div className="sort-buttons">
              {[
                { key: 'date', label: 'Date' },
                { key: 'subject', label: 'Matière' },
                { key: 'difficulty', label: 'Difficulté' },
                { key: 'title', label: 'Titre' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`btn btn-secondary ${sortBy === key ? 'active' : ''}`}
                  onClick={() => handleSortChange(key)}
                >
                  {label}
                  {sortBy === key && (
                    sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {activeFiltersCount > 0 && (
            <button 
              className="btn btn-secondary reset-filters"
              onClick={resetFilters}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Liste des tâches */}
      <div className="todo-list__content">
        {filteredTasks.length === 0 ? (
          <div className="todo-list__empty">
            {tasks.length === 0 ? (
              <>
                <p>Aucune tâche prévue pour aujourd'hui</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={16} />
                  Ajouter votre première tâche
                </button>
              </>
            ) : (
              <p>Aucune tâche ne correspond aux critères de recherche</p>
            )}
          </div>
        ) : (
          <div className="todo-list__tasks">
            {filteredTasks.map((task) => (
              <div key={task.id} data-task-id={task.id}>
                <TaskItem
                  task={task}
                  onComplete={handleCompleteTask}
                  showDate={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'ajout de tâche */}
      {isAddModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
};

export default TodoList;