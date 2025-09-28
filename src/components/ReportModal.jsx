import { Dialog } from "@headlessui/react";
import PropTypes from "prop-types";
import { useState } from "react";

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
    const [motivo, setMotivo] = useState("");

    const handleEnviar = () => {
        if (!motivo.trim()) return;
        onSubmit(motivo);
        setMotivo("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="report-overlay">
            <div className="report-modal">
                <Dialog.Panel className="report-modal-panel">
                    <Dialog.Title className="report-modal-title">Report component</Dialog.Title>
                    <textarea
                        className="report-name-input"
                        placeholder="Write reason for report this component..."
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        rows={4}
                    />
                    <div className="bottom-report-options">
                        <button className="btn-primary" onClick={handleEnviar} disabled={!motivo.trim()
                        }>
                            Submit for review
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

ReportModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ReportModal;
