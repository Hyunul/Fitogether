import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  NotificationProvider,
  useNotifications,
} from "../contexts/NotificationContext";
import { socketService } from "../utils/socket";
import React from "react";

// Socket.io 모킹
vi.mock("../utils/socket", () => ({
  socketService: {
    onNotification: vi.fn(),
    onNotifications: vi.fn(),
    offNotification: vi.fn(),
    offNotifications: vi.fn(),
    emit: vi.fn(),
  },
}));

describe("Notification Context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty notifications", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });
    expect(result.current.notifications).toEqual([]);
  });

  it("should add notification when received from socket", () => {
    const mockNotification = {
      id: "test-id",
      type: "info",
      message: "Test notification",
      createdAt: new Date().toISOString(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });

    // 소켓 이벤트 시뮬레이션
    act(() => {
      const callback = vi.mocked(socketService.onNotification).mock.calls[0][0];
      callback(mockNotification);
    });

    expect(result.current.notifications).toContainEqual(mockNotification);
  });

  it("should remove notification when dismissed", () => {
    const mockNotification = {
      id: "test-id",
      type: "info",
      message: "Test notification",
      createdAt: new Date().toISOString(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });

    // 알림 추가
    act(() => {
      const callback = vi.mocked(socketService.onNotification).mock.calls[0][0];
      callback(mockNotification);
    });

    // 알림 제거
    act(() => {
      result.current.dismissNotification(mockNotification.id);
    });

    expect(result.current.notifications).not.toContainEqual(mockNotification);
  });

  it("should clear all notifications", () => {
    const mockNotifications = [
      {
        id: "test-id-1",
        type: "info",
        message: "Test notification 1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "test-id-2",
        type: "success",
        message: "Test notification 2",
        createdAt: new Date().toISOString(),
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });

    // 알림들 추가
    act(() => {
      const callback = vi.mocked(socketService.onNotification).mock.calls[0][0];
      mockNotifications.forEach((notification) => callback(notification));
    });

    // 모든 알림 제거
    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});
