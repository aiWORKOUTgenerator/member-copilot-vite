'use client';

import { Route, Routes } from 'react-router';
import QuickWorkoutIntakePage from './pages/QuickWorkoutIntakePage';

export default function IntakeContainer() {
  return (
    <Routes>
      <Route
        path="/quick-workout/:locationId"
        element={<QuickWorkoutIntakePage />}
      />
    </Routes>
  );
}
