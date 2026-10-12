"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#1e293b",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </SessionProvider>
  );
}
