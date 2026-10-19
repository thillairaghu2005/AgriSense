import { useState, useMemo } from 'react';
import { Card, PageHeader, Badge, DemoLabel, EmptyState } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormField, Input, Select, Textarea } from '@/components/forms/FormComponents';
import { CROPS } from '@/data/crops';
import type { FarmTask, TaskType, TaskStatus } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';
import { formatDate, isOverdue, generateId } from '@/lib/formatters';
import { useToast } from '@/components/feedback/Toast';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import { useApp } from '@/app/providers';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Trash2,
  Edit2,
  X,
  Filter,
  Sparkles,
  Droplets,
  Sprout,
  ShieldAlert,
  Scissors,
  Tractor,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const TASK_TYPE_ICONS: Record<TaskType, React.ReactNode> = {
  sowing: <Sprout className="w-3.5 h-3.5 text-emerald-600" />,
  irrigation: <Droplets className="w-3.5 h-3.5 text-blue-600" />,
  fertiliser: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
  pesticide: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
  weeding: <Scissors className="w-3.5 h-3.5 text-teal-600" />,
  harvest: <CalendarDays className="w-3.5 h-3.5 text-purple-600" />,
  field_prep: <Tractor className="w-3.5 h-3.5 text-amber-700" />,
  other: <Clock className="w-3.5 h-3.5 text-gray-600" />,
};

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  sowing: 'Sowing',
  irrigation: 'Irrigation',
  fertiliser: 'Fertiliser',
  pesticide: 'Crop Protection',
  weeding: 'Weeding',
  harvest: 'Harvesting',
  field_prep: 'Field Prep',
  other: 'General Task',
};

const DEFAULT_TASKS: FarmTask[] = [
  {
    id: 'task-1',
    title: 'First irrigation after nursery transplanting',
    cropId: 'rice',
    taskType: 'irrigation',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    notes: 'Maintain 2–3 cm standing water level. Check bunds for leakages.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Apply basal dose of DAP and Potash',
    cropId: 'rice',
    taskType: 'fertiliser',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'overdue',
    notes: 'Apply before transplanting as per soil health card guidelines.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Field ploughing & FYM incorporation',
    cropId: 'wheat',
    taskType: 'field_prep',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'completed',
    notes: 'Completed 2 passes of rotavator with 10 tonnes FYM/acre.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Gypsum application at pegging stage',
    cropId: 'groundnut',
    taskType: 'fertiliser',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    notes: 'Apply 200 kg gypsum/acre at 40-45 DAS for pod filling and oil content.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Pheromone trap installation for bollworm monitoring',
    cropId: 'cotton',
    taskType: 'pesticide',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    notes: 'Install 5 traps per acre at crop canopy height to monitor moth activity.',
    createdAt: new Date().toISOString(),
  },
];

export default function CalendarPage() {
  const { t } = useApp();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<FarmTask[]>(() =>
    storageGet(STORAGE_KEYS.TASKS, DEFAULT_TASKS)
  );

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Month navigation for Grid view
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FarmTask | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCropId, setFormCropId] = useState('');
  const [formType, setFormType] = useState<TaskType>('irrigation');
  const [formDueDate, setFormDueDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Crop Template generator
  const [templateCrop, setTemplateCrop] = useState<string>('');

  function saveTasks(updated: FarmTask[]) {
    setTasks(updated);
    storageSet(STORAGE_KEYS.TASKS, updated);
  }

  function handleToggleStatus(task: FarmTask) {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updated = tasks.map(t => (t.id === task.id ? { ...t, status: nextStatus } : t));
    saveTasks(updated);
    showToast(nextStatus === 'completed' ? 'Task marked as completed' : 'Task marked as pending', {
      type: 'success',
    });
  }

  function confirmDelete() {
    if (deleteTargetId) {
      const updated = tasks.filter(t => t.id !== deleteTargetId);
      saveTasks(updated);
      setDeleteTargetId(null);
      showToast('Task removed from farm calendar', { type: 'info' });
    }
  }

  function openCreateModal(dateStr?: string) {
    setEditingTask(null);
    setFormTitle('');
    setFormCropId(selectedCrop !== 'all' ? selectedCrop : 'rice');
    setFormType('irrigation');
    setFormDueDate(dateStr || new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormError('');
    setIsModalOpen(true);
  }

  function openEditModal(task: FarmTask) {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormCropId(task.cropId || '');
    setFormType(task.taskType);
    setFormDueDate(task.dueDate);
    setFormNotes(task.notes);
    setFormError('');
    setIsModalOpen(true);
  }

  function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Task title is required');
      return;
    }
    if (!formDueDate) {
      setFormError('Due date is required');
      return;
    }

    if (editingTask) {
      const updated = tasks.map(t =>
        t.id === editingTask.id
          ? {
              ...t,
              title: formTitle.trim(),
              cropId: formCropId || undefined,
              taskType: formType,
              dueDate: formDueDate,
              notes: formNotes.trim(),
            }
          : t
      );
      saveTasks(updated);
      showToast('Task updated successfully', { type: 'success' });
    } else {
      const newTask: FarmTask = {
        id: generateId(),
        title: formTitle.trim(),
        cropId: formCropId || undefined,
        taskType: formType,
        dueDate: formDueDate,
        status: 'pending',
        notes: formNotes.trim(),
        createdAt: new Date().toISOString(),
      };
      saveTasks([newTask, ...tasks]);
      showToast('New farm task scheduled', { type: 'success' });
    }

    setIsModalOpen(false);
  }

  // 1-Click Template Generator for selected Crop
  function handleGenerateCropSchedule() {
    if (!templateCrop) return;
    const crop = CROPS.find(c => c.id === templateCrop);
    if (!crop) return;

    const todayMs = Date.now();
    const generated: FarmTask[] = crop.growthStages.map(stage => {
      const due = new Date(todayMs + stage.daysFromSowing * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      let taskType: TaskType = 'other';
      if (stage.daysFromSowing === 0) taskType = 'sowing';
      else if (stage.name.toLowerCase().includes('irrigation') || stage.description.toLowerCase().includes('water'))
        taskType = 'irrigation';
      else if (stage.description.toLowerCase().includes('fertilis') || stage.tasks.some(t => t.toLowerCase().includes('fertilis')))
        taskType = 'fertiliser';
      else if (stage.daysFromSowing >= crop.durationDays[0] - 15) taskType = 'harvest';

      return {
        id: generateId(),
        title: `${crop.name}: ${stage.name} (${stage.tasks[0] || stage.description})`,
        cropId: crop.id,
        taskType,
        dueDate: due,
        status: 'pending',
        notes: stage.description,
        createdAt: new Date().toISOString(),
      };
    });

    saveTasks([...generated, ...tasks]);
    setTemplateCrop('');
    showToast(`Added ${generated.length} scheduled stage tasks for ${crop.name}`, { type: 'success' });
  }

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (selectedCrop !== 'all' && t.cropId !== selectedCrop) return false;
        if (selectedType !== 'all' && t.taskType !== selectedType) return false;

        const overdue = t.status !== 'completed' && isOverdue(t.dueDate);
        if (activeTab === 'pending' && (t.status !== 'pending' || overdue)) return false;
        if (activeTab === 'completed' && t.status !== 'completed') return false;
        if (activeTab === 'overdue' && !overdue) return false;

        return true;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks, activeTab, selectedCrop, selectedType]);

  // Calendar Grid Data
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; tasks: FarmTask[] }[] = [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        tasks: tasks.filter(t => t.dueDate === dateStr),
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        tasks: tasks.filter(t => t.dueDate === dateStr),
      });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        tasks: tasks.filter(t => t.dueDate === dateStr),
      });
    }

    return days;
  }, [currentDate, tasks]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('calendar.title')}
        subtitle="Schedule sowing, irrigation schedules, fertiliser splits, and harvest activities"
        badge={<DemoLabel label="Farm management planner" />}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-xs text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-xs text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
                aria-label="Calendar grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => openCreateModal()}
            >
              {t('calendar.addTask')}
            </Button>
          </div>
        }
      />

      {/* 1-Click Crop Schedule Generator Bar */}
      <Card className="p-4 bg-emerald-50/50 border-emerald-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Auto-Generate Crop Stage Schedule
              </h3>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Automatically populates ICAR growth-stage tasks from sowing to harvest.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={templateCrop}
              onChange={e => setTemplateCrop(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-950 outline-none"
            >
              <option value="">Select Crop Template…</option>
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.seasons.join(', ')})
                </option>
              ))}
            </select>
            <Button
              variant="primary"
              size="sm"
              disabled={!templateCrop}
              onClick={handleGenerateCropSchedule}
            >
              Add Stage Tasks
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters & Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-xl w-fit">
          {[
            { id: 'all', label: 'All Tasks', count: tasks.length },
            { id: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending' && !isOverdue(t.dueDate)).length },
            { id: 'overdue', label: 'Overdue', count: tasks.filter(t => t.status !== 'completed' && isOverdue(t.dueDate)).length },
            { id: 'completed', label: 'Done', count: tasks.filter(t => t.status === 'completed').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-[var(--color-text-primary)] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                tab.id === 'overdue' && tab.count > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          <Select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="text-xs py-1"
          >
            <option value="all">All Crops</option>
            {CROPS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs py-1"
          >
            <option value="all">All Operations</option>
            {Object.entries(TASK_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* VIEW 1: MONTHLY CALENDAR GRID */}
      {viewMode === 'grid' && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="text-xs px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] font-medium"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider pb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, idx) => {
              const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={idx}
                  onClick={() => openCreateModal(cell.dateStr)}
                  className={`min-h-[85px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    cell.isCurrentMonth
                      ? 'bg-white border-[var(--color-border)] hover:border-emerald-400 hover:shadow-xs'
                      : 'bg-gray-50/50 border-gray-100 opacity-40'
                  } ${isToday ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-emerald-600 text-white' : 'text-[var(--color-text-primary)]'
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {cell.tasks.length > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1 rounded-full">
                        {cell.tasks.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {cell.tasks.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        onClick={e => {
                          e.stopPropagation();
                          openEditModal(t);
                        }}
                        className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium flex items-center gap-1 ${
                          t.status === 'completed'
                            ? 'bg-gray-100 text-gray-500 line-through'
                            : isOverdue(t.dueDate)
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100/70 text-emerald-900'
                        }`}
                      >
                        {TASK_TYPE_ICONS[t.taskType]}
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                    {cell.tasks.length > 2 && (
                      <span className="text-[9px] text-[var(--color-text-muted)] block pl-1">
                        +{cell.tasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* VIEW 2: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card>
              <EmptyState
                icon={<CalendarDays className="w-12 h-12 text-[var(--color-text-muted)]" />}
                title="No farm tasks match your filters"
                description="Create a custom operation reminder or generate a complete growth-stage schedule from the green template bar above."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => openCreateModal()}
                  >
                    Add Farm Task
                  </Button>
                }
              />
            </Card>
          ) : (
            filteredTasks.map(task => {
              const overdue = task.status !== 'completed' && isOverdue(task.dueDate);
              const completed = task.status === 'completed';
              const crop = CROPS.find(c => c.id === task.cropId);

              return (
                <Card
                  key={task.id}
                  className={`transition-all ${
                    completed
                      ? 'bg-gray-50/80 border-gray-200 opacity-75'
                      : overdue
                      ? 'border-red-200 bg-red-50/20'
                      : 'hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className="mt-0.5 text-[var(--color-text-muted)] hover:text-emerald-600 transition-colors"
                      aria-label={completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                          {TASK_TYPE_ICONS[task.taskType]}
                          <span>{TASK_TYPE_LABELS[task.taskType]}</span>
                        </span>

                        {crop && (
                          <Badge variant="green">
                            🌾 {crop.name}
                          </Badge>
                        )}

                        {completed ? (
                          <Badge variant="gray">✓ Completed</Badge>
                        ) : overdue ? (
                          <Badge variant="red" className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Overdue</span>
                          </Badge>
                        ) : (
                          <Badge variant="amber">Upcoming</Badge>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-semibold text-[var(--color-text-primary)] ${
                          completed ? 'line-through text-[var(--color-text-muted)]' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.notes && (
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                          {task.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Due: {formatDate(task.dueDate)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface-2)]"
                        aria-label="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(task.id)}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-red-600 rounded-lg hover:bg-red-50"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Task Creation & Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[var(--color-border)] p-6 space-y-4 animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                {editingTask ? 'Edit Farm Task' : 'Schedule New Farm Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <FormField label="Task Title" required>
                <Input
                  type="text"
                  placeholder="e.g. Second Urea top dressing or Drip line flush"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Target Crop (Optional)">
                  <Select
                    value={formCropId}
                    onChange={e => setFormCropId(e.target.value)}
                  >
                    <option value="">General (No crop)</option>
                    {CROPS.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Operation Type" required>
                  <Select
                    value={formType}
                    onChange={e => setFormType(e.target.value as TaskType)}
                    required
                  >
                    {Object.entries(TASK_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <FormField label="Due Date" required>
                <Input
                  type="date"
                  value={formDueDate}
                  onChange={e => setFormDueDate(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Notes & Agronomic Instructions">
                <Textarea
                  rows={3}
                  placeholder="e.g. Maintain 3 cm water level; use safety gloves during spray"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                />
              </FormField>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingTask ? 'Save Changes' : 'Schedule Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accessible Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Farm Task"
        message="Are you sure you want to remove this task from your calendar?"
        confirmLabel="Delete Task"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
