import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Task, TaskStatus, UserProfile, NotificationItem, ActivityLog } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Highly detailed compliant Firestore Error parsing and thrower
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Rule Violation / Access Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile Actions
export async function setupUserProfile(uid: string, email: string, displayName: string, photoURL?: string): Promise<UserProfile> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid,
        email,
        username: displayName || email.split('@')[0],
        profileImage: photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
        role: 'user',
        createdAt: new Date().toISOString(),
        bio: 'Core workstation operator.',
        theme: 'neon-purple'
      };
      await setDoc(userRef, newProfile);
      
      // Log initialization
      await writeActivityLog('account_created', 'User workspace established.');
      // Welcome Notification
      await sendInAppNotification(uid, 'success', 'Welcome to NovaTask AI. Operational dashboard is now live.');
      
      return newProfile;
    }
    return snap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
    await writeActivityLog('profile_updated', `Modified workspace settings.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Task CRUD Operations
export async function createTask(taskData: Omit<Task, 'taskId' | 'createdBy' | 'createdAt'>): Promise<string> {
  const taskId = 'task_' + Math.random().toString(36).substring(2, 11);
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not authenticated');

  const newTask: Task = {
    ...taskData,
    taskId,
    createdBy: uid,
    createdAt: new Date().toISOString()
  };

  const path = `tasks/${taskId}`;
  try {
    await setDoc(doc(db, 'tasks', taskId), newTask);
    await writeActivityLog('task_created', `Added task "${newTask.title}"`);
    await sendInAppNotification(uid, 'info', `Task created: ${newTask.title}`);
    return taskId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const path = `tasks/${taskId}`;
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updates);
    await writeActivityLog('task_modified', `Updated properties of task: ${taskId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  const path = `tasks/${taskId}`;
  const uid = auth.currentUser?.uid;
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    await writeActivityLog('task_deleted', `Secured and deleted record: ${taskId}`);
    if (uid) {
      await sendInAppNotification(uid, 'warning', `Task record ${taskId} permanently deleted.`);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// Listeners and Dynamic Real-Time sync
export function listenToTasks(callback: (tasks: Task[]) => void): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};

  const q = query(
    collection(db, 'tasks'),
    where('createdBy', '==', uid)
  );

  const path = 'tasks';
  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push(doc.data() as Task);
    });
    // Sort locally in case composite indexing is initializing
    tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(tasks);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function listenToNotifications(callback: (notifications: NotificationItem[]) => void): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', uid)
  );

  const path = 'notifications';
  return onSnapshot(q, (snapshot) => {
    const notifications: NotificationItem[] = [];
    snapshot.forEach((doc) => {
      notifications.push(doc.data() as NotificationItem);
    });
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(notifications);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function listenToActivityLogs(callback: (logs: ActivityLog[]) => void): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};

  const q = query(
    collection(db, 'activityLogs'),
    where('userId', '==', uid)
  );

  const path = 'activityLogs';
  return onSnapshot(q, (snapshot) => {
    const logs: ActivityLog[] = [];
    snapshot.forEach((doc) => {
      logs.push(doc.data() as ActivityLog);
    });
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(logs);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

// Utility Auditing & Global Feeds

export async function writeActivityLog(action: string, details?: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const logId = 'log_' + Math.random().toString(36).substring(2, 11);
  const path = `activityLogs/${logId}`;
  
  const log: ActivityLog = {
    logId,
    action,
    details,
    userId: uid,
    timestamp: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'activityLogs', logId), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function sendInAppNotification(userId: string, type: 'info' | 'warning' | 'success' | 'alert', message: string): Promise<void> {
  const notificationId = 'notif_' + Math.random().toString(36).substring(2, 11);
  const path = `notifications/${notificationId}`;

  const item: NotificationItem = {
    notificationId,
    userId,
    type,
    message,
    timestamp: new Date().toISOString(),
    read: false
  };

  try {
    await setDoc(doc(db, 'notifications', notificationId), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const path = `notifications/${notificationId}`;
  try {
    const ref = doc(db, 'notifications', notificationId);
    await updateDoc(ref, { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const path = `notifications/${notificationId}`;
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
