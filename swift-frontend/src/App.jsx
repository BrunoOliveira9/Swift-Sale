import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login/Login";
import Inicio from "./pages/inicio/Inicio";
import './styles/global.css';
import 'simple-notify/dist/simple-notify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './services/auth/auth-context.service.tsx';
import ProtectedRoute from './guard/ProtectedRoute.jsx';
import PublicRoute from './guard/PublicRoute.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;