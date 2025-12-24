"use client";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { PatientProvider } from "@/context/PatientContext";

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
      <Footer />
    </>
  );
}
