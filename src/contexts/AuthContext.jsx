import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const loginTimestamp = localStorage.getItem("loginTimestamp");

        if (storedUser && loginTimestamp) {
            const now = Date.now();
            const loginTime = parseInt(loginTimestamp, 10);
            const twoHours = 2 * 60 * 60 * 1000; // 2 horas en ms

            if (now - loginTime > twoHours) {
                logout();
            } else {
                setUsuario(JSON.parse(storedUser));
            }
        }

        // Comprobar activamente cada 5 minutos
        const interval = setInterval(() => {
            const loginTimestamp = localStorage.getItem("loginTimestamp");
            if (loginTimestamp) {
                const now = Date.now();
                const loginTime = parseInt(loginTimestamp, 10);
                const twoHours = 2 * 60 * 60 * 1000;

                if (now - loginTime > twoHours) {
                    logout();
                }
            }
        }, 5 * 60 * 1000); // Cada 5 minutos

        return () => clearInterval(interval);
    }, []);

    const login = (userData, token = null) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loginTimestamp", Date.now().toString());
        if (token) localStorage.setItem("token", token);
        setUsuario(userData);
    };

    const logout = () => {
        navigate("/");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("loginTimestamp");
        setUsuario(null);
    };

    const actualizarUsuario = (nuevosDatos) => {
        const usuarioActualizado = { ...usuario, ...nuevosDatos };
        localStorage.setItem("user", JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, actualizarUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
