import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { LayoutProvider } from "./LayoutProvider";
import { QUERY_CONFIG } from "@/config/query.config";

const queryClient = new QueryClient(QUERY_CONFIG);

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
