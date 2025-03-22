import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/dashboard";
import CalendarPage from "./pages/calendar";
import StudentsPage from "./pages/students";
import InstructorsPage from "./pages/instructors";
import PaymentsPage from "./pages/payments";
import PromotionsPage from "./pages/promotions";
import MessagesPage from "./pages/messages";
import SettingsPage from "./pages/settings";
import ReportsPage from "./pages/reports";
import NotFound from "@/pages/not-found";

function Router() {
  console.log("Router component rendering");
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/students" component={StudentsPage} />
        <Route path="/instructors" component={InstructorsPage} />
        <Route path="/payments" component={PaymentsPage} />
        <Route path="/promotions" component={PromotionsPage} />
        <Route path="/messages" component={MessagesPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
