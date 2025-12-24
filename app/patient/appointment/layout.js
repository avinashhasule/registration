"use client";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export default function AppLayout({ children }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
