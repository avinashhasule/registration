import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const ToastContext = createContext();

export const getToastInitialState = () => ({
  show: false,
  header: "",
  body: "",
  type: "",
});

export const ToastProvider = ({ children }) => {
  const [toastProp, setToastProp] = useState(() => getToastInitialState());

  const closeToast = useCallback(
    () => setToastProp(getToastInitialState()),
    []
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      closeToast();
    }, 5000);

    return () => clearTimeout(timeout);
  });

  return (
    <ToastContext.Provider value={{ toastProp, setToastProp, closeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastType = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  WARNING: "WARNING",
  INFO: "INFO",
};
