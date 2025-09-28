import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ReporteModal = ({ reporte, onClose, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal-expanded" onClick={(e) => e.stopPropagation()}>
                {/* IZQUIERDA - estilo uniforme con ComponenteModal */}
                <div className="modal-left" style={{borderRight: "0px solid #ccc"}}>
                    <h4>Reporte #{reporte?.id}</h4>
                    <hr />

                    <label>Component Title</label>
                    <input value={reporte?.componente?.nombre} disabled />

                    <label>Status</label>
                    <input value={reporte?.componente?.estado} disabled />

                    <label>User</label>
                    <input value={`@${reporte?.componente?.usuario?.slug || "—"}`} disabled />

                    <label>Reason</label>
                    <textarea value={reporte?.motivo} disabled />

                    <label>Report with</label>
                    <input value={`@${reporte?.usuario?.slug || "—"}`} disabled />

                    <div className="modal-actions">
                        <button className="btn-join" onClick={onClose}>Close</button>
                        <button className="btn-join" onClick={() => navigate(`/component/${reporte.componente.id}`)}>View component</button>
                        <button className="btn-danger" onClick={() => onDelete(reporte.componente.id)}>Remove component</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReporteModal.propTypes = {
    reporte: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ReporteModal;
