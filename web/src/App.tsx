import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PointProvider } from "./contexts/PointContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./i18n";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const RoutineList = lazy(() => import("./pages/RoutineList"));
const RoutineDetail = lazy(() => import("./pages/RoutineDetail"));
const CreateRoutine = lazy(() => import("./pages/CreateRoutine"));
const EditRoutine = lazy(() => import("./pages/EditRoutine"));
const ChallengeList = lazy(() => import("./pages/ChallengeList"));
const ChallengeDetail = lazy(() => import("./pages/ChallengeDetail"));
const CreateChallenge = lazy(() => import("./pages/CreateChallenge"));
const EditChallenge = lazy(() => import("./pages/EditChallenge"));
const ReportList = lazy(() => import("./pages/ReportList"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const PointsPage = lazy(() => import("./pages/PointsPage"));

// 레이아웃 컴포넌트
const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/edit",
          element: (
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "routines",
          element: (
            <ProtectedRoute>
              <RoutineList />
            </ProtectedRoute>
          ),
        },
        {
          path: "routines/:id",
          element: (
            <ProtectedRoute>
              <RoutineDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "routines/create",
          element: (
            <ProtectedRoute>
              <CreateRoutine />
            </ProtectedRoute>
          ),
        },
        {
          path: "routines/:id/edit",
          element: (
            <ProtectedRoute>
              <EditRoutine />
            </ProtectedRoute>
          ),
        },
        {
          path: "challenges",
          element: (
            <ProtectedRoute>
              <ChallengeList />
            </ProtectedRoute>
          ),
        },
        {
          path: "challenges/:id",
          element: (
            <ProtectedRoute>
              <ChallengeDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "challenges/create",
          element: (
            <ProtectedRoute>
              <CreateChallenge />
            </ProtectedRoute>
          ),
        },
        {
          path: "challenges/:id/edit",
          element: (
            <ProtectedRoute>
              <EditChallenge />
            </ProtectedRoute>
          ),
        },
        {
          path: "reports",
          element: (
            <ProtectedRoute>
              <ReportList />
            </ProtectedRoute>
          ),
        },
        {
          path: "notifications",
          element: (
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "points",
          element: (
            <ProtectedRoute>
              <PointsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <PointProvider>
            <RouterProvider router={router} />
          </PointProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
