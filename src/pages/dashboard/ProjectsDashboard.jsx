import { useEffect, useState } from "react";
import { getComponentesByUsuario, actualizarComponente } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Link } from "react-router-dom";
import ComponenteModalUser from "./ComponenteModalUser";
import { toast } from "react-hot-toast";

const ProjectsDashboard = () => {
    const { usuario } = useAuth();
    const [componentes, setComponentes] = useState([]);
    const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);

    useEffect(() => {
        if (usuario?.slug) {
            getComponentesByUsuario(usuario.slug)
                .then((data) => setComponentes(data))
                .catch(console.error);
        }
    }, [usuario]);

    const handleGuardar = async (actualizado) => {
        try {
            const datos = await actualizarComponente(componenteSeleccionado.id, {
                ...actualizado,
                estado: "pendiente",
            });

            const nuevos = componentes.map((c) =>
                c.id === componenteSeleccionado.id ? datos : c
            );

            setComponentes(nuevos);
            setComponenteSeleccionado(null);
            toast.success("Your component has been updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error al guardar el componente");
        }
    };

    return (
        <div className="admin-panel">
            <aside className="admin-sidebar">
                <h2>Dashboard</h2>
                <ul>
                    <li className="active"><AutoAwesomeMosaicOutlinedIcon fontSize="small" /> Components</li>
                </ul>
            </aside>

            <section className="admin-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h3>Components</h3>
                        <p className="fw-normal">You can edit multiple projects at once by selecting them below.</p>
                    </div>
                    <Link to="/create" className="btn-join" style={{ background: "#3b82f6", color: "#fff", borderRadius: "8px", padding: "10px 16px" }}>
                        + Create a project
                    </Link>
                </div>

                <div className="admin-table-wrapper" style={{ marginTop: "20px" }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {componentes.map((comp) => (
                                <tr key={comp.id}>
                                    <td>{comp.nombre}</td>
                                    <td>Component</td>
                                    <td>
                                        <span className={`status status-${comp.estado}`}>{comp.estado}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-join"
                                            style={{ margin: 0, width: "30px", height: "30px" }}
                                            onClick={() => setComponenteSeleccionado(comp)}
                                        >
                                            <SettingsOutlinedIcon fontSize="small" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {componentes.length === 0 && (
                        <p style={{ textAlign: "center", color: "#777", marginTop: "30px" }}>No components yet.</p>
                    )}
                    {componenteSeleccionado && (
                        <ComponenteModalUser
                            componente={componenteSeleccionado}
                            onClose={() => setComponenteSeleccionado(null)}
                            onSave={handleGuardar}
                        />
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProjectsDashboard;
