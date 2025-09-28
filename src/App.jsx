import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import "./css/general.css"
import Componente from './pages/Componente';
import Componentes from './pages/Componentes';
import Register from './pages/Register';
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import Layout from './Layout';
import { AuthProvider } from "./contexts/AuthContext";
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProfileSettings from './pages/settings/ProfileSettings';
import AvatarSettings from './pages/settings/AvatarSettings';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorNotFound from './pages/ErrorNotFound';
import Dashboard from './pages/admin/Dashboard';
import { Toaster } from 'react-hot-toast';
import CreateComponent from './pages/CreateComponent';
import ProjectsDashboard from './pages/dashboard/ProjectsDashboard';
import { comprobarConexionAPI } from './services';
import Loader from './components/Loader';
import UpdatePopup from './components/UpdatePopup';
import Error500 from './pages/Error500';
import LoginSuccess from "./pages/LoginSuccess";
import ScrollToTop from "./components/ScrollTop";
import CategoriasComponentes from './pages/CategoriasComponentes';
import Ranking from './pages/Ranking';

nprogress.configure({ showSpinner: false });

function ProgressBar() {
  const location = useLocation();

  useEffect(() => {
    nprogress.start();
    // Espera corta para ver el efecto incluso si la página carga muy rápido
    const timeout = setTimeout(() => nprogress.done(), 600);

    return () => {
      clearTimeout(timeout);
      nprogress.done();
    };
  }, [location]);

  return null;
}

const UPDATE_VERSION = "2025.05.04";

function App() {
  const [conexionOk, setConexionOk] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const seenVersion = localStorage.getItem("lastSeenUpdate");
    if (seenVersion !== UPDATE_VERSION) {
      setShowUpdate(true);
    }
  }, []);

  const handleCloseUpdate = () => {
    localStorage.setItem("lastSeenUpdate", UPDATE_VERSION);
    setShowUpdate(false);
  };

  useEffect(() => {
    const checkAPI = async () => {
      const ok = await comprobarConexionAPI();
      setConexionOk(ok);
    };
  
    checkAPI();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        {conexionOk === null ? (
          <Loader />
        ) : !conexionOk ? (
          <Error500 />
        ) : (
          <>
            <ProgressBar />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/components" element={<Componentes />} />
                <Route path="/categories/:tipo" element={<CategoriasComponentes />} />
                <Route path="/component/:id" element={<Componente />} />
                <Route path="/profile/:slug" element={<Profile />} />
                <Route path="/login-success" element={<LoginSuccess />} />
                <Route path='/ranking' element={<Ranking />} />

                {/* Rutas protegidas */}
                <Route path="/settings/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                <Route path="/settings/avatar" element={<ProtectedRoute><AvatarSettings /></ProtectedRoute>} />
                <Route path="/dashboard/projects" element={<ProtectedRoute><ProjectsDashboard /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreateComponent /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><Dashboard /></ProtectedRoute>} />
              </Route>

              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="*" element={<ErrorNotFound />} />
            </Routes>

            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#1e1e1e",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "500",
                  boxShadow: "none",
                },
                success: { iconTheme: { primary: "#22c55e", secondary: "#1e1e1e" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#1e1e1e" } },
              }}
            />
          </>
        )}
        <UpdatePopup visible={showUpdate} onClose={handleCloseUpdate} />
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App
