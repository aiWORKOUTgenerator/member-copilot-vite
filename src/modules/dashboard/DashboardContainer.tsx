import { Route, Routes } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import StackedLayout from "@/ui/shared/templates/StackedLayout";
import { TitleProvider } from "@/contexts/TitleContext";
import BillingContainer from "./billing/pages/BillingContainer";
import BillingPaymentTab from "./billing/pages/BillingPaymentTab";
import BillingUsageTab from "./billing/pages/BillingUsageTab";
import BillingHistoryTab from "./billing/pages/BillingHistoryTab";
import BillingSubscriptionTab from "./billing/pages/BillingSubscriptionTab";
import WorkoutsPage from "./workouts/WorkoutsPage";
import GeneratePage from "./workouts/GeneratePage";
import WorkoutDetailPage from "./workouts/WorkoutDetailPage";
import ProfileContainer from "./profile/ProfileContainer";
import AttributeDetailPage from "./profile/pages/AttributeDetailPage";
import { ContactProvider } from "@/contexts/ContactContext";
import { UserAccessProvider } from "@/contexts/UserAccessContext";
import { CombinedProviders } from "@/contexts/CombinedProviders";
import { ContactLoadedGuard } from "@/components/ContactLoadedGuard";

export default function DashboardContainer() {
  return (
    <TitleProvider>
      <ContactProvider>
        <UserAccessProvider>
          <CombinedProviders>
            <StackedLayout>
              <ContactLoadedGuard
                fallback={
                  <div className="flex items-center h-40 justify-center">
                    <span className="loading loading-ring loading-xl"></span>
                  </div>
                }
              >
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
                  <Route path="/workouts/generate" element={<GeneratePage />} />
                  <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
                  <Route path="/profile" element={<ProfileContainer />}>
                    <Route
                      path="/profile/:attributeTypeId"
                      element={<AttributeDetailPage />}
                    />
                  </Route>
                </Routes>
              </ContactLoadedGuard>
            </StackedLayout>
          </CombinedProviders>
        </UserAccessProvider>
      </ContactProvider>
    </TitleProvider>
  );
}
