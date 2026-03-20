// Context exports
export { AuthProvider, useAuth } from "./AuthContext";
export { GameProvider, useGame } from "./GameContext";
export { ToastProvider, useToast as useToastContext } from "./ToastContext";

// All providers wrapper
export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GameProvider>
        <ToastProvider>{children}</ToastProvider>
      </GameProvider>
    </AuthProvider>
  );
}
