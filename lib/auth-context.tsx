"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStorageJSON, readStorageString, storageKeys, writeStorageJSON, writeStorageString } from "@/lib/storage";

export type UserRole = "guest" | "personal" | "company-unverified" | "company-verified" | "admin";

export type VerifyStatus = "미인증" | "검수중" | "인증완료" | "반려";

export interface MockAuthState {
  hasContactPass: boolean;
  contactPassExpiry: string | null;
  jumpCredits: number;
  hasPromotion: boolean;
  hasBanner: boolean;
  bannerStatus: "검수중" | "집행중" | null;
  verifyStatus: VerifyStatus;
}

interface AuthContextValue {
  role: UserRole;
  mockState: MockAuthState;
  isReady: boolean;
  setRole: (role: UserRole) => void;
  setMockState: (state: Partial<MockAuthState>) => void;
  resetAuth: () => void;
}

export const ROLES: UserRole[] = ["guest", "personal", "company-unverified", "company-verified", "admin"];

export const DEFAULT_MOCK_STATE: MockAuthState = {
  hasContactPass: false,
  contactPassExpiry: null,
  jumpCredits: 0,
  hasPromotion: false,
  hasBanner: false,
  bannerStatus: null,
  verifyStatus: "미인증",
};

const ROLE_DEFAULTS: Record<UserRole, MockAuthState> = {
  guest: DEFAULT_MOCK_STATE,
  personal: {
    ...DEFAULT_MOCK_STATE,
    hasPromotion: true,
  },
  "company-unverified": {
    ...DEFAULT_MOCK_STATE,
    verifyStatus: "미인증",
  },
  "company-verified": {
    hasContactPass: true,
    contactPassExpiry: "2026-07-07T00:00:00.000Z",
    jumpCredits: 30,
    hasPromotion: false,
    hasBanner: false,
    bannerStatus: null,
    verifyStatus: "인증완료",
  },
  admin: {
    hasContactPass: true,
    contactPassExpiry: null,
    jumpCredits: 100,
    hasPromotion: true,
    hasBanner: true,
    bannerStatus: "집행중",
    verifyStatus: "인증완료",
  },
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isRole(value: string | null): value is UserRole {
  return value !== null && ROLES.includes(value as UserRole);
}

function readMockState() {
  return readStorageJSON<MockAuthState>(storageKeys.mockState, DEFAULT_MOCK_STATE);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("guest");
  const [mockState, setMockStateValue] = useState<MockAuthState>(DEFAULT_MOCK_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedRole = readStorageString(storageKeys.role);
    const nextRole = isRole(storedRole) ? storedRole : "guest";
    setRoleState(nextRole);
    setMockStateValue({ ...ROLE_DEFAULTS[nextRole], ...readMockState() });
    setIsReady(true);
  }, []);

  const setRole = useCallback((nextRole: UserRole) => {
    setRoleState(nextRole);
    setMockStateValue(ROLE_DEFAULTS[nextRole]);
    writeStorageString(storageKeys.role, nextRole);
    writeStorageJSON(storageKeys.mockState, ROLE_DEFAULTS[nextRole]);
  }, []);

  const setMockState = useCallback((state: Partial<MockAuthState>) => {
    setMockStateValue((current) => {
      const next = { ...current, ...state };
      writeStorageJSON(storageKeys.mockState, next);
      return next;
    });
  }, []);

  const resetAuth = useCallback(() => {
    setRole("guest");
  }, [setRole]);

  const value = useMemo<AuthContextValue>(() => ({
    role,
    mockState,
    isReady,
    setRole,
    setMockState,
    resetAuth,
  }), [role, mockState, isReady, setRole, setMockState, resetAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
