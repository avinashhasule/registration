import { createContext, useContext, useMemo, useState } from "react";

const PatientContext = createContext({});

export function PatientProvider({ children }) {
  const [patient, setPatient] = useState({});
  const [canEditABHAAddress, setCanEditABHAAddress] = useState(false);
  const value = useMemo(
    () => ({ patient, setPatient, canEditABHAAddress, setCanEditABHAAddress }),
    [patient, setPatient, canEditABHAAddress, setCanEditABHAAddress]
  );
  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
