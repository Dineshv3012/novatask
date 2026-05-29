/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TaskBoardPage } from './pages/TaskBoardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CalendarPage } from './pages/CalendarPage';
import { NotificationCenterPage } from './pages/NotificationCenterPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { TeamCollaborationPage } from './pages/TeamCollaborationPage';
import { Error404Page } from './pages/Error404Page';

export default function App() {
  return (
    <Router>
      <WorkspaceProvider>
        <Routes>
          {/* Public Spaces */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Cyber Workstations */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/board" 
            element={
              <ProtectedRoute>
                <TaskBoardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <TeamCollaborationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <NotificationCenterPage />
              </ProtectedRoute>
            } 
          />

          {/* Wildcard Error Matrix */}
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </WorkspaceProvider>
    </Router>
  );
}

