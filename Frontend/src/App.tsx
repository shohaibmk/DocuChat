import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import { useAuthStore } from "./store/authStore";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const { isAuthenticated } = useAuthStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <div>Redirect to Dashboard</div> : <Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
