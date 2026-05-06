import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import { useAuthStore } from "./store/authStore";

function App() {
  const { isAuthenticated } = useAuthStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <div>Redirect to Dashboard</div> : <Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
