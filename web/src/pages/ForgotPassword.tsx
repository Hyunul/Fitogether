import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("비밀번호 재설정 이메일 전송:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Fitogether</h1>
          <p className="mt-2 text-sm text-gray-600">함께하는 피트니스 챌린지</p>
        </div>

        <Card>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  비밀번호 찾기
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를
                  보내드립니다.
                </p>
              </div>

              <Input
                label="이메일"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />

              <Button type="submit" variant="primary" className="w-full">
                비밀번호 재설정 링크 보내기
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                이메일을 확인해주세요
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {email}로 비밀번호 재설정 링크를 보냈습니다.
                <br />
                이메일을 확인하시고 링크를 클릭하여 비밀번호를 재설정해주세요.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                다시 시도
              </Button>
            </div>
          )}
        </Card>

        <p className="text-center text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
