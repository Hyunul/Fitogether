import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Home.css";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">{t("home.title")}</h1>
              <p className="hero-description">{t("home.description")}</p>
              {!user && (
                <div className="hero-actions">
                  <Link to="/signup" className="btn btn-outline btn-lg">
                    {t("home.getStarted")}
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    {t("home.login")}
                  </Link>
                </div>
              )}
            </div>
            <div className="hero-image">
              <img src="/hero-image.png" alt="Fitogether" />
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Fitogether의 특별한 기능</h2>
            <p>
              운동을 더 재미있고 효과적으로 만들어주는 다양한 기능을 만나보세요
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h3>{t("home.features.challenges.title")}</h3>
                <p>{t("home.features.challenges.description")}</p>
                <Link to="/challenges" className="feature-link">
                  챌린지 둘러보기 →
                </Link>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h3>{t("home.features.routines.title")}</h3>
                <p>{t("home.features.routines.description")}</p>
                <Link to="/routines" className="feature-link">
                  루틴 둘러보기 →
                </Link>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h3>{t("home.features.community.title")}</h3>
                <p>{t("home.features.community.description")}</p>
                <Link to="/community" className="feature-link">
                  커뮤니티 둘러보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">활성 사용자</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1,000+</div>
              <div className="stat-label">챌린지</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">루틴</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">운동 인증</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>지금 바로 시작하세요</h2>
            <p>Fitogether와 함께 건강한 습관을 만들어보세요</p>
            {!user && (
              <Link to="/signup" className="btn btn-outline btn-lg">
                무료로 시작하기
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
