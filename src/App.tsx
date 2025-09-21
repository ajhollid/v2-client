import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout.tsx";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";
import { UptimesPage } from "@/pages/uptimes";
import { UptimePage } from "@/pages/uptime";
import { CreateUptimePage } from "@/pages/uptimes/create";
import ProtectedRoute from "@/components/util/ProtectedRoute.tsx";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/uptimes" replace />} />

              <Route
                path="/uptimes"
                element={
                  <ProtectedRoute>
                    <UptimesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/uptimes/create"
                element={
                  <ProtectedRoute>
                    <CreateUptimePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/uptime/:id"
                element={
                  <ProtectedRoute>
                    <UptimePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<h1>About</h1>} />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
