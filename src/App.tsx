import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { queryClient } from "@/lib/queryClient";
import {
  LoginScreen,
  RegistrationScreen,
  PasswordRecoveryScreen,
} from "@/pages/auth";
import { AccountsListScreen, AccountDetailScreen } from "@/pages/accounts";
import { BudgetsList, BudgetDetailScreen } from "@/pages/budgets";
import ImprovedDashboard from "@/pages/ImprovedDashboard";
import { ROUTES } from "@/constants/routes";

import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Redirect root to dashboard */}
            <Route
              path={ROUTES.HOME}
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />

            {/* Authentication routes */}
            <Route path={ROUTES.AUTH.LOGIN} element={<LoginScreen />} />
            <Route
              path={ROUTES.AUTH.REGISTER}
              element={<RegistrationScreen />}
            />
            <Route
              path={ROUTES.AUTH.FORGOT_PASSWORD}
              element={<PasswordRecoveryScreen />}
            />

            {/* Protected routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                // <ProtectedRoute>
                <ImprovedDashboard />
                // </ProtectedRoute>
              }
            />

            {/* Account routes */}
            <Route
              path={ROUTES.ACCOUNTS.LIST}
              element={
                // <ProtectedRoute>
                <AccountsListScreen />
                // </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ACCOUNTS.DETAIL}
              element={
                // <ProtectedRoute>
                <AccountDetailScreen />
                // </ProtectedRoute>
              }
            />

            {/* Budget routes */}
            <Route
              path={ROUTES.BUDGETS.LIST}
              element={
                // <ProtectedRoute>
                <BudgetsList />
                // </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.BUDGETS.DETAIL}
              element={
                // <ProtectedRoute>
                <BudgetDetailScreen />
                // </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to dashboard */}
            <Route
              path="*"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
