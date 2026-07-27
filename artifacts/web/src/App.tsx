import { Redirect, Route, Switch } from "wouter";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { Subjects } from "./pages/Subjects";

function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-400 font-['Inter']">
      This page hasn't been built yet.
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={() => <Redirect to="/signin" />} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/subjects">
          <ProtectedRoute>
            <Subjects />
          </ProtectedRoute>
        </Route>
        <Route path="/coming-soon">
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        </Route>
        <Route>
          <div className="min-h-screen flex items-center justify-center text-slate-400 font-['Inter']">
            Page not found
          </div>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default App;
