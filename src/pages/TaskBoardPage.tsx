import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Task, TaskStatus, TaskPriority, SubTask } from '../types';
import { 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock, 
  Tag, 
  HelpCircle, 
  Filter, 
  Star, 
  AlertCircle, 
  PlusCircle, 
  CheckSquare, 
  Link as LinkIcon,
  Grid,
  List,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TaskBoardPage = () => {
  const { 
    tasks, 
    addTask, 
    modifyTask, 
    removeTask, 
    theme,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activePriorityFilter,
    setActivePriorityFilter
  } = useWorkspace();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [newCategory, setNewCategory] = useState('Development');
  const [newDueDate, setNewDueDate] = useState('');
  const [newStatus, setNewStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  
  // Modal Edit states
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [editCategory, setEditCategory] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  const themeColors = {
    'neon-purple': {
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      glow: 'shadow-purple-500/15',
      accent: 'border-purple-500/20',
      bgSolid: 'bg-purple-600'
    },
    'cyan-glow': {
      text: 'text-cyan-400',
      gradient: 'from-cyan-400 to-teal-500',
      glow: 'shadow-cyan-500/15',
      accent: 'border-cyan-500/20',
      bgSolid: 'bg-cyan-500'
    },
    'sunset-pink': {
      text: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-400',
      glow: 'shadow-pink-500/15',
      accent: 'border-pink-500/20',
      bgSolid: 'bg-pink-500'
    },
    'cyberpunk': {
      text: 'text-yellow-400',
      gradient: 'from-yellow-400 to-amber-500',
      glow: 'shadow-yellow-500/15',
      accent: 'border-yellow-500/20',
      bgSolid: 'bg-yellow-400'
    }
  }[theme];

  // List of columns defined by user requirements
  const columns: { label: string; status: TaskStatus; style: string }[] = [
    { label: 'Pending', status: TaskStatus.PENDING, style: 'border-slate-800 bg-slate-900/10' },
    { label: 'In Progress', status: TaskStatus.IN_PROGRESS, style: 'border-cyan-500/15 bg-cyan-950/5' },
    { label: 'Review Hub', status: TaskStatus.REVIEW, style: 'border-purple-500/15 bg-purple-950/5' },
    { label: 'Completed', status: TaskStatus.COMPLETED, style: 'border-emerald-500/15 bg-emerald-950/5' },
    { label: 'Overdue Nodes', status: TaskStatus.OVERDUE, style: 'border-rose-500/15 bg-rose-950/5' }
  ];

  // Map of category values derived dynamically from current tasks
  const derivedCategories = ['All', ...Array.from(new Set(tasks.map(t => t.category)))];

  // Filtering task logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'All' || task.category === activeFilter;
    const matchesPriority = activePriorityFilter === 'All' || task.priority === activePriorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // HTML5 Drag and Drop Handlers
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(status);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await modifyTask(taskId, { status: targetStatus });
    }
  };

  // Manage Creation Flow
  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    await addTask({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: newStatus,
      category: newCategory,
      dueDate: newDueDate || new Date(Date.now() + 86400000 * 3).toISOString()
    });

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewPriority(TaskPriority.MEDIUM);
    setNewCategory('Development');
    setNewDueDate('');
    setNewStatus(TaskStatus.PENDING);
    setIsCreateOpen(false);
  };

  // Manage Edit Flow
  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setEditStatus(task.status);
    setSubtasks(task.subtasks || []);
  };

  const handleSaveEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    await modifyTask(editingTask.taskId, {
      title: editTitle,
      description: editDesc,
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : editingTask.dueDate,
      status: editStatus,
      subtasks
    });

    setEditingTask(null);
  };

  const handleToggleSubtaskCheckbox = (subtaskId: string) => {
    setSubtasks(prev => 
      prev.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
    );
  };

  const handleAddSubtask = () => {
    if (!newSubTaskTitle.trim()) return;
    const newSt: SubTask = {
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      title: newSubTaskTitle,
      completed: false
    };
    setSubtasks([...subtasks, newSt]);
    setNewSubTaskTitle('');
  };

  const handleRemoveSubtask = (subId: string) => {
    setSubtasks(subtasks.filter(s => s.id !== subId));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none h-full flex flex-col">
        
        {/* Dynamic Board Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Quantum Workspace Board
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              DRAG CARDS TO DISPATCH STATUSES IN REAL TIME
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            aria-label="Add new system task"
            className={`flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r ${themeColors.gradient} hover:opacity-90 text-black font-extrabold rounded-full text-xs shadow-md transition-all duration-200 cursor-pointer`}
          >
            <Plus className="w-4 h-4" /> Add System Task
          </button>
        </div>

        {/* Categories, Priority and Custom Search Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 p-4.5 bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {/* Category selection */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Sectors</span>
              <select
                aria-label="Category sector"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-slate-950 border border-white/5 text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none text-[11px]"
              >
                {derivedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority selection */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Threat Matrix</span>
              <select
                aria-label="Priority Threat level"
                value={activePriorityFilter}
                onChange={(e) => setActivePriorityFilter(e.target.value)}
                className="bg-slate-950 border border-white/5 text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none text-[11px]"
              >
                <option value="All">All Priority</option>
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
                <option value={TaskPriority.CRITICAL}>Critical</option>
              </select>
            </div>
          </div>

          {/* Rapid task statistics tracking metrics */}
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 border-l border-white/5 pl-4 hidden md:flex">
            <span>Match Results: {filteredTasks.length} / {tasks.length}</span>
          </div>
        </div>

        {/* Core Column Board Layout Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-6">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter(t => t.status === col.status);
            const isDraggingOver = draggedOverColumn === col.status;

            return (
              <div
                key={col.status}
                onDragOver={(e) => handleDragOver(e, col.status)}
                onDrop={(e) => handleDrop(e, col.status)}
                className={`flex flex-col min-h-[500px] rounded-2xl border p-4 transition-all duration-300 ${col.style} ${
                  isDraggingOver ? 'bg-white/5 border-dashed border-cyan-400/50 scale-[1.01]' : ''
                }`}
              >
                {/* Column header title */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-mono font-bold uppercase tracking-wider">{col.label}</span>
                    <span className="px-2 py-0.5 bg-white/2 rounded-full text-[10px] text-slate-400 font-mono font-bold">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Subtask listing column queue */}
                <div className="flex-1 space-y-3 select-none">
                  {columnTasks.length === 0 ? (
                    <div className="py-12 text-center text-[10px] text-slate-600 font-mono">
                      Sector vacant.
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.taskId}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        className="p-3.5 bg-slate-900/60 backdrop-blur-sm border border-white/5 hover:border-white/15 hover:shadow-lg transition-transform duration-200 active:scale-95 cursor-grab rounded-xl flex flex-col gap-2 group relative"
                      >
                        {/* Rapid Actions */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-200">
                          <button
                            onClick={() => handleOpenEditModal(task)}
                            aria-label="Edit system record"
                            className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Verify: Permanently delete target task node?')) {
                                await removeTask(task.taskId);
                              }
                            }}
                            aria-label="Terminate data record"
                            className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Heading Priority info */}
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{task.category}</span>
                          <span className={`text-[8px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                            task.priority === TaskPriority.CRITICAL ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            task.priority === TaskPriority.HIGH ? 'bg-amber-500/10 text-amber-400' :
                            task.priority === TaskPriority.MEDIUM ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-300/10 text-slate-400'
                          }`}>{task.priority}</span>
                        </div>

                        {/* Title descriptions */}
                        <h4 className="text-xs font-bold text-slate-200 pr-10 hover:text-white transition duration-150 line-clamp-1">{task.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>

                        {/* Progression bar for subtasks */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="space-y-1 mt-1">
                            <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
                              <span>PROCESS FLOWS</span>
                              <span>
                                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${themeColors.gradient}`} 
                                style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Calendar date flags */}
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-white/5 pt-2 mt-1">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                          </span>
                          <button
                            onClick={async () => {
                              await modifyTask(task.taskId, { isFavorite: !task.isFavorite });
                            }}
                            aria-label="Set favorite"
                            className={`p-0.5 hover:scale-110 active:scale-95 transition ${task.isFavorite ? 'text-yellow-400' : 'text-slate-600'}`}
                          >
                            <Star className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified Task Modal Creator */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg p-6 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <h3 className="text-sm font-extrabold text-white tracking-wider font-mono">PROVISION WORKSTATION TASK</h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Mission Command Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Refactor server core integrations..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-slate-100 placeholder:text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Operational Summary Parameter</label>
                  <textarea
                    rows={3}
                    placeholder="This assignment resolves underlying state conflicts..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-slate-100 placeholder:text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Sectors / Categories</label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Development, DevOps..."
                      className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Impact / Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                      className="w-full bg-slate-950 border border-white/5 text-slate-300 rounded-xl py-2 px-3 font-mono"
                    >
                      <option value={TaskPriority.LOW}>Low Intensity</option>
                      <option value={TaskPriority.MEDIUM}>Medium Standard</option>
                      <option value={TaskPriority.HIGH}>High Impact</option>
                      <option value={TaskPriority.CRITICAL}>Critical Redline</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Deployment Deadline</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 text-slate-300 rounded-xl py-2 px-3"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Default Sector Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                      className="w-full bg-slate-950 border border-white/5 text-slate-300 rounded-xl py-2 px-3"
                    >
                      <option value={TaskStatus.PENDING}>Pending</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.REVIEW}>Review</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 bg-gradient-to-r ${themeColors.gradient} hover:opacity-90 text-black font-extrabold rounded-xl transition cursor-pointer`}
                >
                  DEVISE QUANTUM MATRIX RECORD
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Detailed Task Editor + Checklist Modal */}
        {editingTask && (
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xl p-6 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#06b6d4]">OPERATIONAL REACTION MATRIX // {editingTask.taskId}</span>
                <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSaveEditSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold uppercase">Mission Heading</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold uppercase">Record Description</label>
                  <textarea
                    rows={2}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold uppercase">Status Node</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                      className="w-full bg-slate-950 border border-white/5 text-slate-300 rounded-xl py-2 px-3"
                    >
                      <option value={TaskStatus.PENDING}>Pending</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.REVIEW}>Review</option>
                      <option value={TaskStatus.COMPLETED}>Completed</option>
                      <option value={TaskStatus.OVERDUE}>Overdue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold uppercase">Sector Classification</label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold uppercase">Alert Level</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                      className="w-full bg-slate-950 border border-white/5 text-slate-300 rounded-xl py-2 px-3"
                    >
                      <option value={TaskPriority.LOW}>Low</option>
                      <option value={TaskPriority.MEDIUM}>Medium</option>
                      <option value={TaskPriority.HIGH}>High</option>
                      <option value={TaskPriority.CRITICAL}>Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-semibold uppercase">Deployment Target</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 text-slate-300 rounded-xl py-2 px-3"
                    />
                  </div>
                </div>

                {/* Subtask interactive checklist */}
                <div className="border-t border-white/5 pt-3">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-bold">Process Flow Subtasks ({subtasks.length})</label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto mb-3">
                    {subtasks.map((st) => (
                      <div key={st.id} className="flex items-center justify-between p-2 bg-slate-950/40 rounded-lg border border-white/5">
                        <label className="flex items-center gap-2.5 text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={() => handleToggleSubtaskCheckbox(st.id)}
                            className="rounded bg-slate-950 border-white/10"
                          />
                          <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.title}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(st.id)}
                          className="text-rose-500 hover:text-rose-400"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add process milestone..."
                      value={newSubTaskTitle}
                      onChange={(e) => setNewSubTaskTitle(e.target.value)}
                      className="flex-1 bg-slate-950 border border-white/5 rounded-xl py-1.5 px-3 text-white placeholder:text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200"
                    >
                      Inject Step
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="flex-1 py-2.5 bg-white/3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5"
                  >
                    DISCARD CHANGES
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 bg-gradient-to-r ${themeColors.gradient} text-black font-extrabold rounded-xl`}
                  >
                    SAVE PROCESS MODIFICATIONS
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
