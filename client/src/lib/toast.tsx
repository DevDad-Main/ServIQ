import { createContext, useContext, useCallback, ReactNode } from "react";
import { Toaster, toast } from "sonner";

interface ToastOptions {
  style?: React.CSSProperties;
  className?: string;
}

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const toastOptions: ToastOptions = {
  style: {
    background: "#1a1a1a",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  className: "dark-toast",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const success = useCallback((message: string, options?: ToastOptions) => {
    toast.success(message, { ...toastOptions, ...options });
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    toast.error(message, { ...toastOptions, ...options });
  }, []);

  const info = useCallback((message: string, options?: ToastOptions) => {
    toast.info(message, { ...toastOptions, ...options });
  }, []);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    toast.warning(message, { ...toastOptions, ...options });
  }, []);

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export {toast};
