"use client";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export default function AppLayout({ children }) {
  const { user, logout } = {
    user: {
      displayName: "Test User",
      loginOptions: [
        {
          name: "Hospital 1",
          id: 1,
        },
        {
          name: "Hospital 2",
          id: 2,
        },
      ],
    },
    logout: () => {},
  };
  return (
    <>
      <AppHeader />
      {children}
      <Footer />
    </>
  );
}
