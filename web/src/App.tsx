import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RoutineList from "./pages/RoutineList";
import RoutineDetail from "./pages/RoutineDetail";
import CreateRoutine from "./pages/CreateRoutine";
import Profile from "./pages/Profile";
import ChallengeList from "./pages/ChallengeList";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import ChallengeDetail from "./pages/ChallengeDetail";
import CreateChallenge from "./pages/CreateChallenge";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ChallengeCertification from "./pages/ChallengeCertification";
import EditChallenge from "./pages/EditChallenge";
import ChallengeCertifications from "./pages/ChallengeCertifications";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/routines" element={<RoutineList />} />
                <Route path="/routines/:id" element={<RoutineDetail />} />
                <Route path="/routines/create" element={<CreateRoutine />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/challenges" element={<ChallengeList />} />
                <Route path="/challenges/:id" element={<ChallengeDetail />} />
                <Route
                  path="/challenges/create"
                  element={<CreateChallenge />}
                />
                <Route
                  path="/challenges/:id/certify"
                  element={<ChallengeCertification />}
                />
                <Route
                  path="/challenges/:id/edit"
                  element={<EditChallenge />}
                />
                <Route
                  path="/challenges/:id/certifications"
                  element={<ChallengeCertifications />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
