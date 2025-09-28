import { useState } from "react";
import { Dialog } from "@headlessui/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
// Icons
import SmartButtonOutlinedIcon from "@mui/icons-material/SmartButtonOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";

const categories = [
    { label: "Button", icon: <SmartButtonOutlinedIcon /> },
    { label: "Checkbox", icon: <CheckBoxOutlinedIcon /> },
    { label: "Card", icon: <ViewAgendaOutlinedIcon /> },
    { label: "Input", icon: <TextFieldsOutlinedIcon /> },
];

const CreateModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);
    const [showNameModal, setShowNameModal] = useState(false);
    const [nombre, setNombre] = useState("");

    return (
        <>
            {/* Modal 1: Selección de categoría */}
            <Dialog open={isOpen} onClose={onClose} className="create-overlay">
                <div className="create-modal">
                    <Dialog.Panel className="create-modal-panel">
                        <Dialog.Title className="create-modal-title">What are you making?</Dialog.Title>

                        <div className="component-grid">
                            {categories.map((cat, index) => (
                                <div
                                    key={index}
                                    className={`component-card ${selected === cat.label ? "selected" : ""}`}
                                    onClick={() => setSelected(cat.label)}
                                >
                                    <span className="component-icon">{cat.icon}</span>
                                    <p>{cat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bottom-create-options">
                            <p>What do you want to use?</p>
                            <div className="code-type-buttons">
                                <button className="btn-code-type selected">CSS</button>
                            </div>
                            <button
                                className="btn-primary"
                                disabled={!selected}
                                onClick={() => {
                                    if (selected) {
                                        setShowNameModal(true);
                                    }
                                }}
                            >
                                Continue
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Modal 2: Escribir nombre del componente */}
            <Dialog open={showNameModal} onClose={() => setShowNameModal(false)} className="create-overlay">
                <div className="create-modal">
                    <Dialog.Panel className="create-modal-panel">
                        <Dialog.Title className="create-modal-title">Give it a name</Dialog.Title>

                        <input
                            type="text"
                            className="create-name-input"
                            placeholder="e.g. Hero Card"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />

                        <div className="bottom-create-options">
                            <button
                                className="btn-primary"
                                disabled={!nombre}
                                onClick={() => {
                                    console.log("✅ Nombre:", nombre, "Categoría:", selected);
                                    setShowNameModal(false);
                                    onClose();
                                    
                                    const query = new URLSearchParams({
                                        type: selected,
                                        name: nombre
                                    }).toString();

                                    navigate(`/create?${query}`);
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
};

export default CreateModal;

CreateModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};