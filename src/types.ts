export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  name: string;
  url: string;
  size: string;
}

export interface Task {
  taskId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  dueDate: string;
  attachments?: Attachment[];
  subtasks?: SubTask[];
  isFavorite?: boolean;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  profileImage?: string;
  role?: string;
  createdAt: string;
  bio?: string;
  theme?: 'neon-purple' | 'cyan-glow' | 'sunset-pink' | 'cyberpunk';
}

export interface NotificationItem {
  notificationId: string;
  userId: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityLog {
  logId: string;
  action: string;
  details?: string;
  userId: string;
  timestamp: string;
}

export interface AISuggestion {
  title: string;
  reason: string;
  priority: TaskPriority;
  category: string;
}
