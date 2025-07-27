import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./components/ui/theme-provider";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import SimplifiedDashboard from "@/pages/simplified-dashboard";
import SettingsPage from "@/pages/settings-page";
import SubscribePage from "@/pages/subscribe-page";
import LandingPage from "@/pages/landing-page";
import BlogPage from "@/pages/blog-page";
import BlogPostPage from "@/pages/blog-post-page";
import AddTradePage from "@/pages/add-trade-page";
import TradeHistoryPage from "@/pages/trade-history-page";
import AnalyticsPage from "@/pages/analytics-page";
import TagsPage from "@/pages/tags-page";
import ExportDataPage from "@/pages/export-data-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <ProtectedRoute path="/dashboard" component={SimplifiedDashboard} />
      <ProtectedRoute path="/add-trade" component={AddTradePage} />
      <ProtectedRoute path="/trades" component={TradeHistoryPage} />
      <ProtectedRoute path="/analytics" component={AnalyticsPage} />
      <ProtectedRoute path="/tags" component={TagsPage} />
      <ProtectedRoute path="/export" component={ExportDataPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/subscribe" component={SubscribePage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
