import { useState, useEffect, useRef } from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { getNotificaciones, toggleNotificacionVista } from "../services";

const NotificationCenter = () => {
    const [open, setOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const ref = useRef();

    // Cierra el popup si haces clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cargar notificaciones reales al abrir
    useEffect(() => {
        getNotificaciones()
            .then(setNotificaciones)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (open) {
            getNotificaciones()
                .then(setNotificaciones)
                .catch(console.error);
        }
    }, [open]);

    const cantidadNoLeidas = notificaciones.filter(n => !n.is_read).length;

    return (
        <div className="notification-wrapper" ref={ref}>
            <button className="notification-button" onClick={() => setOpen(!open)}>
                <NotificationsNoneOutlinedIcon fontSize="medium" />
                {cantidadNoLeidas > 0 && (
                    <span className="notification-badge">{cantidadNoLeidas}</span>
                )}
            </button>

            {open && (
                <div className="notification-popup">
                    <div className="notification-header">Notifications</div>

                    {notificaciones.length === 0 ? (
                        <p className="no-notifications">No notifications yet</p>
                    ) : (
                        <ul className="notification-list">
                            {notificaciones.map((n) => (
                                <li
                                    key={n.id}
                                    className={`notification-item ${n.is_read ? "visto" : "unread"}`}
                                    onClick={() => {
                                        toggleNotificacionVista(n.id).then((data) => {
                                            setNotificaciones((prev) =>
                                                prev.map((notif) =>
                                                    notif.id === n.id ? { ...notif, is_read: data.is_read } : notif
                                                )
                                            );
                                        }).catch(console.error);
                                    }}
                                >
                                    <span className={`notification-indicator tipo-${n.type}`}></span>
                                    <div className="notification-content">
                                        <p>{n.message}</p>
                                        <span className="notification-time">
                                            {new Date(n.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </li>

                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
