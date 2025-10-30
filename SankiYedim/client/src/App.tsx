import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import Landing from "@/pages/landing";
import About from "@/pages/about";
import Dashboard from "@/pages/dashboard";
import Entries from "@/pages/entries";
import Transfers from "@/pages/transfers";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        {() => (
          <PublicLayout>
            <Landing />
          </PublicLayout>
        )}
      </Route>
      <Route path="/about">
        {() => (
          <PublicLayout>
            <About />
          </PublicLayout>
        )}
      </Route>
      
      {/* App Routes */}
      <Route path="/dashboard">
        {() => (
          <AppLayout>
            <Dashboard />
          </AppLayout>
        )}
      </Route>
      <Route path="/entries">
        {() => (
          <AppLayout>
            <Entries />
          </AppLayout>
        )}
      </Route>
      <Route path="/transfers">
        {() => (
          <AppLayout>
            <Transfers />
          </AppLayout>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <AppLayout>
            <Settings />
          </AppLayout>
        )}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
