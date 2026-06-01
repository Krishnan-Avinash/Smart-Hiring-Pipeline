import { createContext, useContext, useEffect, useState } from "react";

export const SnackbarContext = createContext();

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export default function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState("");

  const showSnackbar = (message) => {
    setSnackbar(message);

    setTimeout(() => {
      setSnackbar("");
    }, 3000);
  };

  useEffect(() => {
    const message = sessionStorage.getItem("globalSnackbar");

    if (message) {
      showSnackbar(message);
      sessionStorage.removeItem("globalSnackbar");
    }
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {snackbar && (
        <div className="global-snackbar">
          {snackbar}
        </div>
      )}
    </SnackbarContext.Provider>
  );
}