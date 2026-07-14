import { createContext, useContext, useState, useCallback } from "react";

export const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastPortal toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// Inline portal to avoid circular imports
function ToastPortal({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          role="alert"
        >
          <span className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => onRemove(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
