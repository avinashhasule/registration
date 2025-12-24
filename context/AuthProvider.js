"use client";
import { apihelper, includeToken } from "@/utils/Client";
import { usePathname, useRouter } from "next/navigation";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";

export const AuthContext = createContext({});

export function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    if (value !== undefined) {
      if (includeToken) window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);
  return [value, setValue];
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useStickyState("", "patient-portal-token");
  const [user, setUser] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      const response = await apihelper(`patientportal/Login/VerifySession`);
      if (response?.status) {
        if (includeToken) setToken(response.success?.token);
        setUser({
          mobileNumber: response.success?.username,
        });
        setLoading(false);
        if (
          pathname === "/login" ||
          pathname === "/" ||
          pathname.includes("/login/")
        )
          router.push("/patient");
      } else {
        window.localStorage.removeItem("patient-portal-token");
        setLoading(false);
        if (!pathname.includes("/login")) router.push("/login");
      }
    };
    // if (logoutBtnClicked) return;
    if (user?.mobileNumber || pathname.includes("billdetails")) return;
    if (!user?.mobileNumber && pathname.includes("login")) return;
    verifyUser();
  }, [pathname, router, setToken, user?.mobileNumber]);

  const handleLogin = useCallback(
    async (data) => {
      setToken(data);
    },
    [setToken]
  );

  const handleLogout = useCallback(async () => {
    await apihelper(`patientportal/Login/Logout`);
    setLoading(true);
    setToken("");
    setUser({});
    window.localStorage.removeItem("patient-portal-token");
    window.location.href = "/login";
    setLoading(false);
  }, [setToken]);

  const value = useMemo(
    () => ({
      token,
      handleLogin,
      loading,
      setLoading,
      handleLogout,
      user,
      setUser,
    }),
    [token, handleLogin, loading, setLoading, handleLogout, user, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const {
    token,
    handleLogin,
    loading,
    setLoading,
    user,
    setUser,
    handleLogout,
  } = useContext(AuthContext);
  return {
    token,
    handleLogin,
    loading,
    setLoading,
    user,
    setUser,
    handleLogout,
  };
};
