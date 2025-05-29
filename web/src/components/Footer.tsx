import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-3">
            <h2>Fitogether</h2>
            <p className="text-muted">함께하는 운동의 즐거움</p>
          </div>
          <div className="col-6 col-md-3">
            <h3>서비스</h3>
            <ul className="list-unstyled">
              <li>
                <Link to="/challenges" className="text-muted">
                  챌린지
                </Link>
              </li>
              <li>
                <Link to="/routines" className="text-muted">
                  루틴
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted">
                  프로필
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h3>지원</h3>
            <ul className="list-unstyled">
              <li>
                <Link to="/help" className="text-muted">
                  도움말
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h3>법적 고지</h3>
            <ul className="list-unstyled">
              <li>
                <Link to="/terms" className="text-muted">
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-top">
          <p className="text-center text-muted py-3 mb-0">
            &copy; {new Date().getFullYear()} Fitogether. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
