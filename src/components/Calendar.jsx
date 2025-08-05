import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import TaskItem from './TaskItem.jsx';
import AddTaskModal from './AddTaskModal.jsx';
import { 
  getTasksByMonth, 
  getTasksByDate, 
  completeTask,
  SUBJECTS,
  formatDate 
} from '../utils/storage.js';

/**
 * Composant calendrier mensuel avec affichage des tâches
 * Permet de naviguer entre les mois et de voir les tâches par jour
 */
const Calendar = ({ onTaskUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskDate, setNewTaskDate] = useState(null);

  // Charge les tâches du mois courant
  useEffect(() => {
    loadMonthTasks();
  }, [currentDate]);

  // Charge les tâches du mois
  const loadMonthTasks = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthTasks = getTasksByMonth(year, month);
    setTasks(monthTasks);
  };

  // Navigation entre les mois
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null); // Reset la sélection lors du changement de mois
  };

  // Retourne au mois courant
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // Gère le clic sur un jour
  const handleDayClick = (date) => {
    const dateString = formatDate(date);
    setSelectedDate(selectedDate === dateString ? null : dateString);
  };

  // Gère le double-clic pour ajouter une tâche
  const handleDayDoubleClick = (date) => {
    setNewTaskDate(formatDate(date));
    setIsAddModalOpen(true);
  };

  // Gère la completion d'une tâche
  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
    loadMonthTasks();
    
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  };

  // Gère l'ajout d'une nouvelle tâche
  const handleAddTask = () => {
    loadMonthTasks();
    setIsAddModalOpen(false);
    setNewTaskDate(null);
    
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  };

  // Obtient les informations du mois courant
  const getMonthInfo = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    // Premier jour de la semaine (lundi = 1, dimanche = 0)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    return {
      year,
      month,
      firstDay,
      lastDay,
      firstDayOfWeek,
      daysInMonth: lastDay.getDate()
    };
  };

  // Génère les jours du calendrier
  const generateCalendarDays = () => {
    const { year, month, firstDayOfWeek, daysInMonth } = getMonthInfo();
    const days = [];
    
    // Jours du mois précédent pour compléter la première semaine
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Jours du mois courant
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: formatDate(date) === formatDate(today)
      });
    }
    
    // Jours du mois suivant pour compléter la dernière semaine
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(nextYear, nextMonth, day),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  // Obtient les tâches d'un jour spécifique
  const getDayTasks = (date) => {
    const dateString = formatDate(date);
    return tasks.filter(task => task.date === dateString);
  };

  // Obtient les tâches sélectionnées
  const getSelectedTasks = () => {
    if (!selectedDate) return [];
    return getTasksByDate(selectedDate);
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const calendarDays = generateCalendarDays();
  const selectedTasks = getSelectedTasks();

  return (
    <div className="calendar">
      {/* En-tête du calendrier */}
      <div className="calendar__header">
        <div className="calendar__navigation">
          <button 
            className="btn btn-secondary"
            onClick={() => navigateMonth(-1)}
            title="Mois précédent"
          >
            <ChevronLeft size={16} />
          </button>
          
          <h2 className="calendar__title">
            <CalendarIcon size={20} />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button 
            className="btn btn-secondary"
            onClick={() => navigateMonth(1)}
            title="Mois suivant"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="calendar__actions">
          <button 
            className="btn btn-secondary"
            onClick={goToToday}
            title="Aujourd'hui"
          >
            Aujourd'hui
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
            title="Ajouter une tâche"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {/* Grille du calendrier */}
      <div className="calendar__grid">
        {/* En-têtes des jours de la semaine */}
        <div className="calendar__weekdays">
          {weekDays.map(day => (
            <div key={day} className="calendar__weekday">
              {day}
            </div>
          ))}
        </div>

        {/* Jours du calendrier */}
        <div className="calendar__days">
          {calendarDays.map((day, index) => {
            const dayTasks = getDayTasks(day.date);
            const dateString = formatDate(day.date);
            const isSelected = selectedDate === dateString;
            
            return (
              <div
                key={index}
                className={`calendar__day ${!day.isCurrentMonth ? 'calendar__day--other-month' : ''} ${day.isToday ? 'calendar__day--today' : ''} ${isSelected ? 'calendar__day--selected' : ''} ${dayTasks.length > 0 ? 'calendar__day--has-tasks' : ''}`}
                onClick={() => day.isCurrentMonth && handleDayClick(day.date)}
                onDoubleClick={() => day.isCurrentMonth && handleDayDoubleClick(day.date)}
                title={day.isCurrentMonth ? `${day.date.getDate()} ${monthNames[day.date.getMonth()]}${dayTasks.length > 0 ? ` - ${dayTasks.length} tâche${dayTasks.length > 1 ? 's' : ''}` : ''}` : ''}
              >
                <span className="calendar__day-number">
                  {day.date.getDate()}
                </span>
                
                {/* Affichage des tâches */}
                {dayTasks.length > 0 && (
                  <div className="calendar__day-tasks">
                    {dayTasks.slice(0, 3).map((task, taskIndex) => {
                      const subject = SUBJECTS[task.subject];
                      return (
                        <div
                          key={taskIndex}
                          className="calendar__task"
                          style={{ backgroundColor: subject.color }}
                          title={`${subject.name}: ${task.title}`}
                        >
                          <span className="calendar__task-title">
                            {task.title}
                          </span>
                        </div>
                      );
                    })}
                    
                    {/* Indicateur de tâches supplémentaires */}
                    {dayTasks.length > 3 && (
                      <div className="calendar__more-tasks">
                        +{dayTasks.length - 3} de plus
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Panneau latéral des tâches sélectionnées */}
      {selectedDate && (
        <div className="calendar__sidebar">
          <div className="calendar__sidebar-header">
            <h3>
              Tâches du {new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </h3>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedDate(null)}
              title="Fermer"
            >
              ✕
            </button>
          </div>
          
          <div className="calendar__sidebar-content">
            {selectedTasks.length === 0 ? (
              <div className="calendar__sidebar-empty">
                <p>Aucune tâche prévue ce jour</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDayDoubleClick(new Date(selectedDate))}
                >
                  <Plus size={16} />
                  Ajouter une tâche
                </button>
              </div>
            ) : (
              <div className="calendar__sidebar-tasks">
                {selectedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    showDate={false}
                    compact={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal d'ajout de tâche */}
      {isAddModalOpen && (
        <AddTaskModal
          onClose={() => {
            setIsAddModalOpen(false);
            setNewTaskDate(null);
          }}
          onAdd={handleAddTask}
          initialDate={newTaskDate}
        />
      )}
    </div>
  );
};

export default Calendar;