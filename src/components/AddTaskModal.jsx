import React, { useState } from 'react';
import { X, Calendar, BookOpen, AlertCircle, Plus } from 'lucide-react';
import { addTask, SUBJECTS, DIFFICULTY_LEVELS, formatDate } from '../utils/storage.js';

/**
 * Modal pour ajouter une nouvelle tâche
 * Permet de saisir toutes les informations nécessaires
 */
const AddTaskModal = ({ onClose, onAdd, initialDate }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: 'droit-civil',
    difficulty: 'moyen',
    date: initialDate || formatDate(new Date())
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Gère les changements dans les champs du formulaire
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Efface l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Valide le formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }

    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'La date ne peut pas être dans le passé';
      }
    }

    if (!SUBJECTS[formData.subject]) {
      newErrors.subject = 'Matière invalide';
    }

    if (!DIFFICULTY_LEVELS[formData.difficulty]) {
      newErrors.difficulty = 'Difficulté invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Ajoute la tâche
      addTask({
        title: formData.title.trim(),
        subject: formData.subject,
        difficulty: formData.difficulty,
        date: formData.date
      });

      // Notifie le parent
      if (onAdd) {
        onAdd();
      }

      // Ferme le modal
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
      setErrors({ submit: 'Une erreur est survenue lors de l\'ajout de la tâche' });
    } finally {
      setIsLoading(false);
    }
  };

  // Gère la fermeture avec échappement
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Suggestions de dates rapides
  const getQuickDateOptions = () => {
    const today = new Date();
    return [
      { label: "Aujourd'hui", value: formatDate(today) },
      { label: "Demain", value: formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)) },
      { label: "Dans 3 jours", value: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)) },
      { label: "Dans 1 semaine", value: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) }
    ];
  };

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="modal-header">
          <h2>
            <Plus size={20} />
            Ajouter une tâche
          </h2>
          <button 
            className="modal-close"
            onClick={onClose}
            title="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Titre */}
          <div className="form-group">
            <label htmlFor="title">
              Titre de la tâche *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Réviser le chapitre sur les contrats"
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Matière */}
          <div className="form-group">
            <label htmlFor="subject">
              <BookOpen size={16} />
              Matière *
            </label>
            <select
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className={errors.subject ? 'error' : ''}
            >
              {Object.entries(SUBJECTS).map(([key, subject]) => (
                <option key={key} value={key}>{subject.name}</option>
              ))}
            </select>
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </div>

          {/* Difficulté */}
          <div className="form-group">
            <label htmlFor="difficulty">
              <AlertCircle size={16} />
              Difficulté *
            </label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className={errors.difficulty ? 'error' : ''}
            >
              {Object.entries(DIFFICULTY_LEVELS).map(([key, difficulty]) => (
                <option key={key} value={key}>{difficulty.name}</option>
              ))}
            </select>
            {errors.difficulty && <span className="error-message">{errors.difficulty}</span>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">
              <Calendar size={16} />
              Date prévue *
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={formatDate(new Date())}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
            
            {/* Suggestions de dates */}
            <div className="quick-date-options">
              {getQuickDateOptions().map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={`quick-date-btn ${formData.date === value ? 'active' : ''}`}
                  onClick={() => handleInputChange('date', value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Erreur de soumission */}
          {errors.submit && (
            <div className="error-message error-message--global">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Ajout...' : 'Ajouter la tâche'}
            </button>
          </div>
        </form>

        {/* Aperçu */}
        {formData.title && (
          <div className="task-preview">
            <h4>Aperçu</h4>
            <div 
              className="task-preview__item"
              style={{ 
                '--subject-color': SUBJECTS[formData.subject]?.color,
                '--difficulty-color': DIFFICULTY_LEVELS[formData.difficulty]?.color
              }}
            >
              <div className="task-preview__subject-bar" style={{ backgroundColor: SUBJECTS[formData.subject]?.color }}></div>
              <div className="task-preview__content">
                <div className="task-preview__header">
                  <span className="task-preview__subject" style={{ color: SUBJECTS[formData.subject]?.color }}>
                    {SUBJECTS[formData.subject]?.name}
                  </span>
                  <span className="task-preview__difficulty" style={{ color: DIFFICULTY_LEVELS[formData.difficulty]?.color }}>
                    {DIFFICULTY_LEVELS[formData.difficulty]?.name}
                  </span>
                </div>
                <div className="task-preview__title">{formData.title}</div>
                <div className="task-preview__date">
                  {new Date(formData.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTaskModal;