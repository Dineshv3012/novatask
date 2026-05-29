import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { 
  setupUserProfile, 
  listenToTasks, 
  listenToNotifications, 
  listenToActivityLogs, 
  updateUserProfile,
  createTask as createTaskDb,
  updateTask as updateTaskDb,
  deleteTask as deleteTaskDb,
  markNotificationAsRead as markNotificationReadDb,
  deleteNotification as deleteNotificationDb,
  writeActivityLog
} from '../lib/db';
import { Task, UserProfile, NotificationItem, ActivityLog, AISuggestion } from '../types';

interface WorkspaceContextProps {
  currentUser: User | null;
  userProfile: UserProfile | null;
  tasks: Task[];
  notifications: NotificationItem[];
  logs: ActivityLog[];
  loading: boolean;
  theme: 'neon-purple' | 'cyan-glow' | 'sunset-pink' | 'cyberpunk';
  aiSuggestions: AISuggestion[];
  aiLoading: boolean;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  activePriorityFilter: string;
  setActivePriorityFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  setTheme: (themeName: 'neon-purple' | 'cyan-glow' | 'sunset-pink' | 'cyberpunk') => void;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshAISuggestions: () => Promise<void>;
  addTask: (task: Omit<Task, 'taskId' | 'createdBy' | 'createdAt'>) => Promise<string>;
  modifyTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  markNotifRead: (id: string) => Promise<void>;
  removeNotif: (id: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  
  // UI state
  const [theme, setLocalTheme] = useState<'neon-purple' | 'cyan-glow' | 'sunset-pink' | 'cyberpunk'>('neon-purple');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activePriorityFilter, setActivePriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state with login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          // Initialize/fetch user profile in Firestore
          const profile = await setupUserProfile(
            user.uid,
            user.email || '',
            user.displayName || '',
            user.photoURL || undefined
          );
          setUserProfile(profile);
          if (profile.theme) {
            setLocalTheme(profile.theme);
          }
        } catch (e) {
          console.error("Profile synchronization error:", e);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setTasks([]);
        setNotifications([]);
        setLogs([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync real-time snapshot listeners when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const unsubTasks = listenToTasks((fetchedTasks) => {
      setTasks(fetchedTasks);
    });

    const unsubNotifs = listenToNotifications((fetchedNotifs) => {
      setNotifications(fetchedNotifs);
    });

    const unsubLogs = listenToActivityLogs((fetchedLogs) => {
      setLogs(fetchedLogs);
    });

    return () => {
      unsubTasks();
      unsubNotifs();
      unsubLogs();
    };
  }, [currentUser]);

  // Sync static suggestions once when tasks are ready, to avoid excessive API loads
  useEffect(() => {
    if (currentUser && tasks.length > 0 && aiSuggestions.length === 0) {
      refreshAISuggestions();
    }
  }, [currentUser, tasks.length]);

  const setTheme = async (newTheme: 'neon-purple' | 'cyan-glow' | 'sunset-pink' | 'cyberpunk') => {
    setLocalTheme(newTheme);
    if (currentUser) {
      setUserProfile((prev) => prev ? { ...prev, theme: newTheme } : null);
      await updateUserProfile(currentUser.uid, { theme: newTheme });
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Ensure we prompt to select account cleanly in preview iFrame
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      await writeActivityLog('login', `Logged in via Google provider auth.`);
    } catch (e) {
      console.error("Authentication failed:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await writeActivityLog('logout', `Logged out of NovaTask workspace.`);
      await signOut(auth);
    } catch (e) {
      console.error("Authorization termination failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const refreshAISuggestions = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/gemini/suggest-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tasks.slice(0, 10), // Pass a sample to stay within token limits cleanly
          username: userProfile?.username || currentUser?.displayName || "Nova Workstation Operator",
          focusCategory: activeFilter !== 'All' ? activeFilter : ""
        })
      });
      const data = await response.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error("Error communicating with recommendation server:", e);
    } finally {
      setAiLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'taskId' | 'createdBy' | 'createdAt'>) => {
    const id = await createTaskDb(task);
    return id;
  };

  const modifyTask = async (taskId: string, updates: Partial<Task>) => {
    await updateTaskDb(taskId, updates);
  };

  const removeTask = async (taskId: string) => {
    await deleteTaskDb(taskId);
  };

  const markNotifRead = async (id: string) => {
    await markNotificationReadDb(id);
  };

  const removeNotif = async (id: string) => {
    await deleteNotificationDb(id);
  };

  return (
    <WorkspaceContext.Provider value={{
      currentUser,
      userProfile,
      tasks,
      notifications,
      logs,
      loading,
      theme,
      aiSuggestions,
      aiLoading,
      activeFilter,
      setActiveFilter,
      activePriorityFilter,
      setActivePriorityFilter,
      searchQuery,
      setSearchQuery,
      setTheme,
      loginWithGoogle,
      logoutUser,
      refreshAISuggestions,
      addTask,
      modifyTask,
      removeTask,
      markNotifRead,
      removeNotif
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be mounted inside a WorkspaceProvider');
  }
  return context;
};
