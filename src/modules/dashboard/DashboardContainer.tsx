import { ContactLoadedGuard } from "@/components/ContactLoadedGuard";
import { CombinedProviders } from "@/contexts/CombinedProviders";
import { ContactProvider } from "@/contexts/ContactContext";
import { TitleProvider } from "@/contexts/TitleContext";
import { TrainerPersonaProvider } from "@/contexts/TrainerPersonaContext";
import { UserAccessProvider } from "@/contexts/UserAccessContext";
import StackedLayout from "@/ui/shared/templates/StackedLayout";
import { Route, Routes } from "react-router";
import BillingContainer from "./billing/pages/BillingContainer";
import BillingHistoryTab from "./billing/pages/BillingHistoryTab";
import BillingPaymentTab from "./billing/pages/BillingPaymentTab";
import BillingSubscriptionTab from "./billing/pages/BillingSubscriptionTab";
import BillingUsageTab from "./billing/pages/BillingUsageTab";
import DashboardPage from "./pages/DashboardPage";
import ProfileContainer from "./profile/ProfileContainer";
import AttributeDetailPage from "./profile/pages/AttributeDetailPage";
import GeneratingTrainerPage from "./trainer/pages/GeneratingTrainerPage";
import MyAITrainerPage from "./trainer/pages/MyAITrainerPage";
import GeneratePage from "./workouts/GeneratePage";
import WorkoutDetailPage from "./workouts/WorkoutDetailPage";
import WorkoutInstancePage from "./workouts/WorkoutInstancePage";
import WorkoutsPage from "./workouts/WorkoutsPage";

export default function DashboardContainer() {
  return (
    <TitleProvider>
      <ContactProvider>
        <UserAccessProvider>
          <CombinedProviders>
            <TrainerPersonaProvider>
              <Routes>
                {/* Standalone workout instance route - no layout */}
                <Route
                  path="/workouts/instances/:id"
                  element={<WorkoutInstancePage />}
                />

                {/* All other routes with ContactLoadedGuard and StackedLayout */}
                <Route
                  path="*"
                  element={
                    <ContactLoadedGuard
                      fallback={
                        <div className="flex items-center h-40 justify-center">
                          <span className="loading loading-ring loading-xl"></span>
                        </div>
                      }
                    >
                      <StackedLayout>
                        <Routes>
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/billing" element={<BillingContainer />}>
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
                          <Route path="/workouts" element={<WorkoutsPage />} />
                          <Route
                            path="/workouts/generate"
                            element={<GeneratePage />}
                          />
                          <Route
                            path="/workouts/:id"
                            element={<WorkoutDetailPage />}
                          />
                          <Route path="/profile" element={<ProfileContainer />}>
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
                      </StackedLayout>
                    </ContactLoadedGuard>
                  }
                />
              </Routes>
            </TrainerPersonaProvider>
          </CombinedProviders>
        </UserAccessProvider>
      </ContactProvider>
    </TitleProvider>
  );
}
