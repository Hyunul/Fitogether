import React, { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

const EditProfile: React.FC = () => {
  const [form, setForm] = useState({
    name: "홍길동",
    email: "hong@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    bio: "운동을 좋아하는 개발자입니다.",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("프로필 수정:", form);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">프로필 수정</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-3xl text-gray-500">
                  {form.name.charAt(0)}
                </span>
              </div>
              <Button variant="outline">프로필 이미지 변경</Button>
            </div>

            <Input
              label="이름"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              label="이메일"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                비밀번호 변경
              </h2>
              <Input
                label="현재 비밀번호"
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
              />
              <Input
                label="새 비밀번호"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
              />
              <Input
                label="새 비밀번호 확인"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                자기소개
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                취소
              </Button>
              <Button type="submit" variant="primary">
                저장하기
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
