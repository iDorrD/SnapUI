import { useState, useEffect } from "react";
import "../../services";
import { getComponentes, actualizarComponente, getUsuarios, getReportes, eliminarComponente } from "../../services";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ComponenteModal from "./ComponenteModal";
import { toast } from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";
import ReporteModal from "./ReporteModal";
// import Soon from "../../components/Soon";


const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const idToEdit = searchParams.get("edit");

    const [tab, setTab] = useState("componentes");
    const [componentes, setComponentes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [reportes, setReportes] = useState([]);
    const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

    const formatFecha = (fecha) => {
        if (!fecha) return "—";
        const parsed = typeof fecha === "string" ? new Date(fecha.replace(" ", "T")) : new Date(fecha);
        return isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString();
    };

    useEffect(() => {
        getComponentes().then((data) => {
            setComponentes(data);

            if (idToEdit) {
                const componente = data.find((c) => c.id === parseInt(idToEdit));
                if (componente) {
                    setComponenteSeleccionado(componente);
                }
            }
        });
    }, [idToEdit]);

    useEffect(() => {
        if (tab === "usuarios") {
            getUsuarios().then(setUsuarios).catch(console.error);
        }
    }, [tab]);

    useEffect(() => {
        if (tab === "reportes") {
            getReportes().then(setReportes).catch(console.error);
        }
    }, [tab]);



    return (
        <div className="admin-panel">
            <aside className="admin-sidebar">
                <h2>Admin Dashboard</h2>
                <ul>
                    <li
                        className={tab === "componentes" ? "active" : ""}
                        onClick={() => setTab("componentes")}
                    >
                        Component Manager
                    </li>
                    <li
                        className={tab === "reportes" ? "active" : ""}
                        onClick={() => setTab("reportes")}
                    >
                        Reports
                    </li>
                    <li
                        className={tab === "usuarios" ? "active" : ""}
                        onClick={() => setTab("usuarios")}
                    >
                        Users
                    </li>
                </ul>
            </aside>

            <section className="admin-content">
                {/* Component Manager */}
                {tab === "componentes" && (
                    <div>
                        <h3><GridViewOutlinedIcon fontSize="large" /> Component Manager</h3>
                        <p style={{ color: "gray", fontWeight: 500 }}>Manage your components here.</p>
                        <hr />
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                    <th>Author</th>
                                    <th>Favorites</th>
                                </tr>
                            </thead>
                            <tbody>
                                {componentes.map((comp) => (
                                    <tr
                                        key={comp.id}
                                        className="row-clickable"
                                        onClick={() => setComponenteSeleccionado(comp)}
                                    >
                                        <td>{comp.id}</td>
                                        <td>{comp.nombre}</td>
                                        <td>
                                            <span className={`status status-${comp.estado}`}>{comp.estado}</span>
                                        </td>
                                        <td>{new Date(comp.created_at).toLocaleDateString()}</td>
                                        <td>{new Date(comp.updated_at).toLocaleDateString()}</td>
                                        <td>@{comp.usuario?.slug || "—"}</td>
                                        <td>{comp.favoritos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === "reportes" && (
                    <div>
                        <h3><FlagOutlinedIcon fontSize="large" />Reports</h3>
                        <p style={{ color: "gray", fontWeight: 500 }}>Manage your reports here.</p>
                        <hr />
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Reported component</th>
                                    <th>User</th>
                                    <th>Reason</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportes.map((rep) => (
                                    <tr key={rep.id} className="row-clickable" onClick={() => setReporteSeleccionado(rep)}>
                                        <td>{rep.id}</td>
                                        <td>{rep.componente?.nombre || "—"}</td>
                                        <td>@{rep.usuario?.slug}</td>
                                        <td>{rep.motivo.length > 10 ? `${rep.motivo.slice(0, 10)}...` : rep.motivo}</td>
                                        <td>{new Date(rep.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {tab === "usuarios" && (
                    <div>
                        <h3><GroupOutlinedIcon fontSize="large" />Users</h3>
                        <p style={{ color: "gray", fontWeight: 500 }}>Manage your users here.</p>
                        <hr />
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value.toLowerCase())}
                            className="w-100"
                        />

                        <table className="admin-table mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios
                                    .filter((u) =>
                                        u.name.toLowerCase().includes(busqueda)
                                    )
                                    .map((usuario) => {
                                        console.log("created_at:", usuario.created_at);
                                        console.log("updated_at:", usuario.updated_at);

                                        return (
                                            <tr key={usuario.id}>
                                                <td>{usuario.id}</td>
                                                <td>{usuario.name}</td>
                                                <td>{usuario.slug}</td>
                                                <td>{formatFecha(usuario.created_at)}</td>
                                                <td>{formatFecha(usuario.updated_at)}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>

                    </div>
                )}
            </section>

            {componenteSeleccionado && (() => {
                return (
                    <ComponenteModal
                        componente={componenteSeleccionado}
                        onClose={() => setComponenteSeleccionado(null)}
                        onSave={(formData) => {
                            actualizarComponente(componenteSeleccionado.id, formData)
                                .then(() => {
                                    return getComponentes();
                                })
                                .then((actualizados) => {
                                    setComponentes(actualizados);
                                    setComponenteSeleccionado(null);
                                    toast.success("Component '" + formData.nombre + "' updated successfully!");
                                })
                                .catch((err) => {
                                    console.error("Error actualizando componente:", err);
                                    toast.error("Error updating component: " + err.message);
                                });
                        }}
                    />

                );
            })()}
            {reporteSeleccionado && (
                <ReporteModal
                    reporte={reporteSeleccionado}
                    onClose={() => setReporteSeleccionado(null)}
                    onDelete={(id) => {
                        eliminarComponente(id)
                            .then(() => {
                                toast.success("Componente eliminado correctamente.");
                                setReporteSeleccionado(null);
                                getReportes().then(setReportes);
                            })
                            .catch((err) => {
                                console.error("Error al eliminar:", err);
                                toast.error("Error al eliminar componente.");
                            });
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
