import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(t("auth.loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{t("auth.login")}</h1>
          <p>{t("auth.loginDescription")}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t("auth.email")}
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t("auth.password")}
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? t("common.loading") : t("auth.login")}
          </button>
        </form>

        <div className="auth-divider">
          <span>{t("auth.or")}</span>
        </div>

        <div className="social-auth">
          <button
            className="social-button"
            style={{ backgroundColor: "#4285F4", color: "#fff" }}
          >
            {/* <img src="/google-icon.svg" alt="Google" /> */}
            {t("auth.continueWithGoogle")}
          </button>
          <button
            className="social-button"
            style={{ backgroundColor: "#FEE500", color: "#000" }}
          >
            {/* <img src="/kakao-icon.svg" alt="Kakao" /> */}
            {t("auth.continueWithKakao")}
          </button>
        </div>

        <div className="auth-footer">
          {t("auth.noAccount")} <Link to="/signup">{t("auth.signup")}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
