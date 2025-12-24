"use client";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { ToastProvider } from "@/hooks/useToast";
import { PatientProvider } from "@/context/PatientContext";
import { MastersProvider } from "@/context/MastersProvider";

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <PatientProvider>
        <MastersProvider>
          <ToastProvider>{children}</ToastProvider>
        </MastersProvider>
      </PatientProvider>
    </AuthProvider>
  );
}
