import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { eliminarComponente } from "../../services";
import { Dialog } from "@headlessui/react";


const ComponenteModalUser = ({ componente, onClose, onSave }) => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState(componente.nombre);
    const [codigoHtml, setCodigoHtml] = useState(componente.codigo_html);
    const [codigoCss, setCodigoCss] = useState(componente.codigo_css);
    const [showConfirm, setShowConfirm] = useState(false);
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
            codigo_html: codigoHtml,
            codigo_css: codigoCss,
            estado: "pendiente",
        });
        navigate("/");
    };

    const onDelete = () => {
        eliminarComponente(componente.id)
            .then(() => {
                onClose();
                navigate("/");
            })
            .catch((error) => {
                console.error("Error deleting component:", error);
            });
    };

    return (
        <>
            <div className="admin-modal-overlay" onClick={onClose}>
                <div className="admin-modal-expanded" onClick={(e) => e.stopPropagation()}>
                    {/* IZQUIERDA */}
                    <div className="modal-left">
                        <h4>Edit Component</h4>
                        <p className="subtitle fw-normal">You can&apos;t change status or creator of this component. Only moderators can do that. And if you can change code automatically set the &quot;Pendiente&quot;</p>
                        <hr />

                        <label>Title</label>
                        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

                        <label>HTML Code</label>
                        <textarea value={codigoHtml} onChange={(e) => setCodigoHtml(e.target.value)} draggable />

                        <label>CSS Code</label>
                        <textarea value={codigoCss} onChange={(e) => setCodigoCss(e.target.value)} />

                        <div className="modal-actions">
                            <button className="btn-join" onClick={onClose}>Cancel</button>
                            <button className="btn-join" onClick={() => navigate(`/component/${componente.id}`)}>View</button>
                            <button className="btn-danger" onClick={onDelete}>Remove</button>
                            <button className="btn-save" onClick={() => setShowConfirm(true)}>Save</button>
                        </div>
                    </div>

                    {/* DERECHA */}
                    <div className="modal-right">
                        <iframe ref={iframeRef} title="preview" width="100%" height="100%" style={{ border: "none" }} />
                    </div>
                </div>
            </div>
            <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} className="create-overlay confirm-overlay">
                <div className="create-modal">
                    <Dialog.Panel className="create-modal-panel">
                        <Dialog.Title className="create-modal-title">Send for review?</Dialog.Title>
                        <p className="fw-normal">When saving changes, this component will be marked as <strong>pending</strong> and must be re-approved by the moderation team.</p>

                        <div className="bottom-create-options" style={{ display: "flex", justifyContent: "space-between" }}>
                            <button className="btn-join" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="btn-save" onClick={() => {
                                setShowConfirm(false);
                                handleSubmit();
                            }}>
                                Confirm & Save
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

        </>
    );
};

ComponenteModalUser.propTypes = {
    componente: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default ComponenteModalUser;
