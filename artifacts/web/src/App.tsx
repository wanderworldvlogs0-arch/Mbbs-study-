import { Redirect, Route, Switch } from "wouter";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { Subjects } from "./pages/Subjects";
import { Videos } from "./pages/Videos";
import { Pdfs } from "./pages/Pdfs";
import { Quiz } from "./pages/Quiz"; 
import { Flashcards } from "./pages/Flashcards";
import { AIDoubtSolver } from "./pages/AIDoubtSolver";
import { Progress } from "./pages/Progress";
import { Rewards } from "./pages/Rewards";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { SearchPage } from "./pages/Search";
import { Notes } from "./pages/Notes";

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
        <Route path="/videos">
          <ProtectedRoute>
            <Videos />
          </ProtectedRoute>
        </Route>
        <Route path="/pdfs">
          <ProtectedRoute>
            <Pdfs />
          </ProtectedRoute>
        </Route>
        <Route path="/quiz">                
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        </Route>
        <Route path="/flashcards">
  <ProtectedRoute>
    <Flashcards />
  </ProtectedRoute>
</Route>
        <Route path="/ai-solver">
  <ProtectedRoute>
    <AIDoubtSolver />
  </ProtectedRoute>
</Route>
        <Route path="/progress">
  <ProtectedRoute>
    <Progress />
  </ProtectedRoute>
</Route>
<Route path="/rewards">
  <ProtectedRoute>
    <Rewards />
  </ProtectedRoute>
</Route>
        <Route path="/search">
  <ProtectedRoute>
    <SearchPage />
  </ProtectedRoute>
</Route>
        <Route path="/settings">
  <ProtectedRoute>
    <Settings />
  </ProtectedRoute>
</Route>
        <Route path="/profile">
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
</Route>
        <Route path="/notes">
  <ProtectedRoute>
    <Notes />
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
