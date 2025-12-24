"use client";
import AppHeader from "@/components/AppHeader";

export default function AppLayout({ children, ...props }) {
  const { user, logout } = {
    user: {
      displayName: "Test User",
      loginOptions: [],
    },
    logout: () => {},
  };
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
