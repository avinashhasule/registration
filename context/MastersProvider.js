import { createContext, useContext, useMemo, useState } from "react";

const MasterContext = createContext({});

export function MastersProvider({ children }) {
  const [masters, setMasters] = useState(null);

  const value = useMemo(() => ({ masters, setMasters }), [masters, setMasters]);

  return (
    <MasterContext.Provider value={value}>{children}</MasterContext.Provider>
  );
}
export function useMaster() {
  const context = useContext(MasterContext);
  if (context === undefined) {
    throw new Error("useMaster must be used within a MasterProvider");
  }
  return context;
}
