import { ContactLoadedGuard } from '@/components/ContactLoadedGuard';
import { AttributeTypeProvider } from '@/contexts/AttributeTypeContext';
import { CombinedProviders } from '@/contexts/CombinedProviders';
import { ContactProvider } from '@/contexts/ContactContext';
import { CurrentWorkoutInstanceProvider } from '@/contexts/CurrentWorkoutInstanceContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { PromptProvider } from '@/contexts/PromptContext';
import { TrainerPersonaProvider } from '@/contexts/TrainerPersonaContext';
import { UserAccessProvider } from '@/contexts/UserAccessContext';
import { HeaderLayout } from '@/ui';
import { Route, Routes } from 'react-router';
import BillingContainer from './billing/pages/BillingContainer';
import BillingHistoryTab from './billing/pages/BillingHistoryTab';
import BillingPaymentTab from './billing/pages/BillingPaymentTab';
import BillingSubscriptionTab from './billing/pages/BillingSubscriptionTab';
import BillingUsageTab from './billing/pages/BillingUsageTab';
import { ContactLoadingIndicator } from './components/ContactLoadingIndicator';
import DashboardPage from './pages/DashboardPage';
import ProfileContainer from './profile/ProfileContainer';
import AttributeDetailPage from './profile/pages/AttributeDetailPage';
import GeneratingTrainerPage from './trainer/pages/GeneratingTrainerPage';
import MyAITrainerPage from './trainer/pages/MyAITrainerPage';
import GeneratePage from './workouts/GeneratePage';
import WorkoutDetailPage from './workouts/WorkoutDetailPage';
import WorkoutHistoryPage from './workouts/WorkoutHistoryPage';
import WorkoutInstancePage from './workouts/WorkoutInstancePage';
import WorkoutsPage from './workouts/WorkoutsPage';
import { AttributeProvider } from '@/contexts/AttributeContext';

export default function DashboardContainer() {
  return (
    <UserAccessProvider>
      <Routes>
        {/* Standalone workout instance route - no layout */}
        <Route
          path="/workouts/instances/:id"
          element={
            <ContactProvider>
              <ContactLoadedGuard fallback={<ContactLoadingIndicator />}>
                <div className="w-full max-w-full overflow-x-hidden">
                  <TrainerPersonaProvider>
                    <CurrentWorkoutInstanceProvider>
                      <WorkoutInstancePage />
                    </CurrentWorkoutInstanceProvider>
                  </TrainerPersonaProvider>
                </div>
              </ContactLoadedGuard>
            </ContactProvider>
          }
        />

        {/* All other routes with ContactLoadedGuard and StackedLayout */}
        <Route
          path="*"
          element={
            <ContactProvider>
              <PromptProvider>
                <AttributeTypeProvider>
                  <AttributeProvider>
                    <HeaderLayout>
                      <ContactLoadedGuard
                        fallback={<ContactLoadingIndicator />}
                      >
                        <CombinedProviders>
                          <TrainerPersonaProvider>
                            <LocationProvider>
                              <Routes>
                                <Route path="/" element={<DashboardPage />} />
                                <Route
                                  path="/billing"
                                  element={<BillingContainer />}
                                >
                                  <Route
                                    path="/billing"
                                    element={<BillingSubscriptionTab />}
                                  />
                                  <Route
                                    path="/billing/payment"
                                    element={<BillingPaymentTab />}
                                  />
                                  <Route
                                    path="/billing/usage"
                                    element={<BillingUsageTab />}
                                  />
                                  <Route
                                    path="/billing/history"
                                    element={<BillingHistoryTab />}
                                  />
                                </Route>
                                <Route
                                  path="/workouts"
                                  element={<WorkoutsPage />}
                                />
                                <Route
                                  path="/workouts/history"
                                  element={<WorkoutHistoryPage />}
                                />
                                <Route
                                  path="/workouts/generate"
                                  element={<GeneratePage />}
                                />
                                <Route
                                  path="/workouts/:id"
                                  element={<WorkoutDetailPage />}
                                />
                                <Route
                                  path="/profile"
                                  element={<ProfileContainer />}
                                >
                                  <Route
                                    path="/profile/:attributeTypeId"
                                    element={<AttributeDetailPage />}
                                  />
                                </Route>
                                <Route
                                  path="/trainer"
                                  element={<MyAITrainerPage />}
                                />
                                <Route
                                  path="/trainer/generating"
                                  element={<GeneratingTrainerPage />}
                                />
                              </Routes>
                            </LocationProvider>
                          </TrainerPersonaProvider>
                        </CombinedProviders>
                      </ContactLoadedGuard>
                    </HeaderLayout>
                  </AttributeProvider>
                </AttributeTypeProvider>
              </PromptProvider>
            </ContactProvider>
          }
        />
      </Routes>
    </UserAccessProvider>
  );
}
