import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import NotificationIcon from "./NotificationIcon";
import PointDisplay from "./PointDisplay";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              {t("common.appName")}
            </Link>
            <ul className="navbar-nav d-none d-md-flex">
              <li className="nav-item">
                <Link
                  to="/challenges"
                  className={`nav-link ${
                    isActive("/challenges") ? "active" : ""
                  }`}
                >
                  {t("common.challenges")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/routines"
                  className={`nav-link ${
                    isActive("/routines") ? "active" : ""
                  }`}
                >
                  {t("common.routines")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-right">
            <div className="navbar-actions">
              {/* <PointDisplay /> */}
              <NotificationIcon />
              <button
                onClick={toggleTheme}
                className="btn btn-link nav-link"
                aria-label={
                  theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
                }
              >
                {theme === "dark" ? (
                  <svg
                    className="icon-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="icon-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {user ? (
              <div className="navbar-auth">
                <Link
                  to="/profile"
                  className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                >
                  {t("common.profile")}
                </Link>
                <button onClick={logout} className="btn btn-link nav-link">
                  {t("common.logout")}
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link
                  to="/login"
                  className={`nav-link ${isActive("/login") ? "active" : ""}`}
                >
                  {t("common.login")}
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  {t("common.signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
