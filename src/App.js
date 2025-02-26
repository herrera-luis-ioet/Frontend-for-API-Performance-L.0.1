import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/Dashboard';
import PerformanceDetail from './components/PerformanceDetail';
import NotFound from './components/NotFound';

// PUBLIC_INTERFACE
function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/performance/:apiId" element={<PerformanceDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
