import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { eliminarComponente } from "../../services";

const ComponenteModal = ({ componente, onClose, onSave }) => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState(componente.nombre);
    const [estado, setEstado] = useState(componente.estado);
    const [codigoHtml, setCodigoHtml] = useState(componente.codigo_html);
    const [codigoCss, setCodigoCss] = useState(componente.codigo_css);
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!iframeRef.current) return;

        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        doc.open();
        doc.write(`
        <html><head>
        <style>
            html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background: #111;
            display: flex;
            justify-content: center;
            align-items: center;
            }
            ${codigoCss}
        </style>
        </head><body>${codigoHtml}</body></html>
    `);
        doc.close();
    }, [codigoHtml, codigoCss]);

    const handleSubmit = () => {
        onSave({
            nombre,
            estado,
            codigo_html: codigoHtml,
            codigo_css: codigoCss,
        });
    };

    const onDelete = async (id) => {
        eliminarComponente(id)
            .then(() => {
                onClose();
                navigate("/");
            })
            .catch((error) => {
                console.error("Error deleting component:", error);
            });
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal-expanded" onClick={(e) => e.stopPropagation()}>
                {/* IZQUIERDA */}
                <div className="modal-left">
                    <h4>Edit Component</h4>
                    <hr />

                    <label>Title</label>
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

                    <label>Status</label>
                    <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="aprobado">Aprobado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="rechazado">Rechazado</option>
                    </select>

                    <label>Creator</label>
                    <input value={componente.usuario?.slug || "—"} disabled />

                    <label>HTML Code</label>
                    <textarea value={codigoHtml} onChange={(e) => setCodigoHtml(e.target.value)} draggable />

                    <label>CSS Code</label>
                    <textarea value={codigoCss} onChange={(e) => setCodigoCss(e.target.value)} />

                    <div className="modal-actions">
                        <button className="btn-join" onClick={onClose}>Cancel</button>
                        <button className="btn-join" onClick={()=>navigate(`/component/${componente.id}`)}>View</button>
                        <button className="btn-danger" onClick={() => onDelete(componente.id)}>Remove</button>
                        <button className="btn-save" onClick={handleSubmit}>Save</button>
                    </div>
                </div>

                {/* DERECHA */}
                <div className="modal-right">
                    <iframe ref={iframeRef} title="preview" width="100%" height="100%" style={{ border: "none" }} />
                </div>
            </div>
        </div>
    );
};

ComponenteModal.propTypes = {
    componente: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default ComponenteModal;
