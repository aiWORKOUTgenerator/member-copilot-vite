'use client';

import { Route, Routes } from 'react-router';
import QuickWorkoutIntakePage from './pages/QuickWorkoutIntakePage';
import { GeneratedWorkoutProvider } from '@/contexts/GeneratedWorkoutContext';

export default function IntakeContainer() {
  return (
    <GeneratedWorkoutProvider>
      <Routes>
        <Route
          path="/quick-workout/:locationId"
          element={<QuickWorkoutIntakePage />}
        />
      </Routes>
    </GeneratedWorkoutProvider>
  );
}
