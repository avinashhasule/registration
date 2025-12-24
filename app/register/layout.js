"use client";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
export default function AppLayout({ children, ...props }) {
  const { user, logout } = {
    user: {
      displayName: "Test User",
      loginOptions: [
        { name: "Org 1", href: "#" },
        { name: "Org 2", href: "#" },
        { name: "Org 3", href: "#" },
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
