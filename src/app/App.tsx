import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/app/auth/AuthProvider";
import { SignInDialog } from "@/app/auth/SignInDialog";
import { HomePage } from "@/app/pages/HomePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HomePage onSignIn={() => setShowSignIn(true)} />
        <SignInDialog open={showSignIn} onClose={() => setShowSignIn(false)} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
