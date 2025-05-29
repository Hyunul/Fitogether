import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { User } from "firebase/auth";

// Firebase Auth 모킹
vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("../firebase", () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
}));

describe("Auth Context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with null user", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it("should login user successfully", async () => {
    const mockUser = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      getIdToken: vi.fn().mockResolvedValue("test-token"),
    };

    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    } as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.user).toEqual({
      id: "test-uid",
      email: "test@example.com",
      name: "Test User",
      token: "test-token",
    });
  });

  it("should signup user successfully", async () => {
    const mockUser = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      getIdToken: vi.fn().mockResolvedValue("test-token"),
    };

    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    } as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signup("Test User", "test@example.com", "password");
    });

    expect(result.current.user).toEqual({
      id: "test-uid",
      email: "test@example.com",
      name: "Test User",
      token: "test-token",
    });
  });

  it("should logout user successfully", async () => {
    const mockUser = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      getIdToken: vi.fn().mockResolvedValue("test-token"),
    };

    vi.mocked(signOut).mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 먼저 로그인 상태 설정
    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    // 로그아웃 실행
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });

  it("should update user profile successfully", async () => {
    const mockUser = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      getIdToken: vi.fn().mockResolvedValue("test-token"),
    };

    Object.defineProperty(auth, "currentUser", {
      get: () => mockUser,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // 먼저 로그인 상태 설정
    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    // 프로필 업데이트
    await act(async () => {
      await result.current.updateProfile({ name: "Updated Name" });
    });

    expect(result.current.user?.name).toBe("Updated Name");
  });
});
