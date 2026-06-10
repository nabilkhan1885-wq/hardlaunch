import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import PatientDetails from '../pages/PatientDetails';
import Visits from '../pages/Visits';
import Documents from '../pages/Documents';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';

// Public routes (no authentication required)
const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Private routes (authentication required)
const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/patients" element={
        <ProtectedRoute>
          <Layout>
            <Patients />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/patients/:id" element={
        <ProtectedRoute>
          <Layout>
            <PatientDetails />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/visits" element={
        <ProtectedRoute>
          <Layout>
            <Visits />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/documents" element={
        <ProtectedRoute>
          <Layout>
            <Documents />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Layout>
            <Analytics />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Routes component
const AppRoutes = ({ isAuthenticated }) => {
  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};

export default AppRoutes;