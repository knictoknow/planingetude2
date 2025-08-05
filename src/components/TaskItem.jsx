import React from 'react';
import { Check, Calendar, BookOpen, AlertCircle, Repeat } from 'lucide-react';
import { SUBJECTS, DIFFICULTY_LEVELS, formatDate, parseDate } from '../utils/storage.js';

/**
 * Composant pour afficher une tâche individuelle
 * Affiche toutes les informations de la tâche et permet de la marquer comme terminée
 */
const TaskItem = ({ task, onComplete, onEdit, showDate = true, compact = false }) => {
  const subject = SUBJECTS[task.subject] || SUBJECTS['autres'];
  const difficulty = DIFFICULTY_LEVELS[task.difficulty] || DIFFICULTY_LEVELS['moyen'];
  
  // Calcule si la tâche est en retard
  const taskDate = parseDate(task.date);
  const today = new Date();
  const isOverdue = taskDate < today;
  const isToday = formatDate(taskDate) === formatDate(today);

  // Gère le clic sur le bouton "Terminé"
  const handleComplete = () => {
    if (onComplete) {
      onComplete(task.id);
    }
  };

  // Gère le clic sur la tâche pour l'édition
  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  // Formate la date d'affichage
  const getDateDisplay = () => {
    if (isToday) return "Aujourd'hui";
    if (isOverdue) return `En retard (${taskDate.toLocaleDateString('fr-FR')})`;
    return taskDate.toLocaleDateString('fr-FR');
  };

  return (
    <div 
      className={`task-item ${compact ? 'task-item--compact' : ''} ${isOverdue ? 'task-item--overdue' : ''}`}
      style={{
        '--subject-color': subject.color,
        '--difficulty-color': difficulty.color
      }}
    >
      {/* Bandeau coloré de la matière */}
      <div className="task-item__subject-bar" style={{ backgroundColor: subject.color }}></div>
      
      <div className="task-item__content" onClick={handleEdit}>
        {/* En-tête avec matière et difficulté */}
        <div className="task-item__header">
          <div className="task-item__subject">
            <BookOpen size={16} />
            <span>{subject.name}</span>
          </div>
          
          <div className="task-item__difficulty" style={{ color: difficulty.color }}>
            <AlertCircle size={14} />
            <span>{difficulty.name}</span>
          </div>
        </div>

        {/* Titre de la tâche */}
        <h3 className="task-item__title">{task.title}</h3>

        {/* Informations supplémentaires */}
        <div className="task-item__meta">
          {showDate && (
            <div className={`task-item__date ${isOverdue ? 'task-item__date--overdue' : ''} ${isToday ? 'task-item__date--today' : ''}`}>
              <Calendar size={14} />
              <span>{getDateDisplay()}</span>
            </div>
          )}
          
          {task.isRepetition && (
            <div className="task-item__repetition">
              <Repeat size={14} />
              <span>Révision J+{task.repetitionNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bouton de validation */}
      <button 
        className="task-item__complete-btn btn btn-success"
        onClick={handleComplete}
        title="Marquer comme terminé"
      >
        <Check size={18} />
        {!compact && <span>Révisée</span>}
      </button>
    </div>
  );
};

export default TaskItem;