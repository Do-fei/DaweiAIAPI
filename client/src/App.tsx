import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import StatsPage from "./pages/StatsPage";
import PricingPage from "./pages/PricingPage";
import DocsPage from "./pages/DocsPage";
import ProfilePage from "./pages/ProfilePage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/chat"} component={ChatPage} />
      <Route path={"/api-keys"} component={ApiKeysPage} />
      <Route path={"/stats"} component={StatsPage} />
      <Route path={"/pricing"} component={PricingPage} />
      <Route path={"/docs"} component={DocsPage} />
      <Route path={"/profile"} component={ProfilePage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
