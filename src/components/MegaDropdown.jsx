import { useNavigate } from "react-router-dom";
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';
import SmartButtonOutlinedIcon from '@mui/icons-material/SmartButtonOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';

const MegaDropdown = ({ visible }) => {
    const navigate = useNavigate();

    if (!visible) return null;

    return (
        <div className="mega-dropdown">
            <div className="mega-column">
                <button onClick={() => navigate("/categories/all")}><ImportContactsOutlinedIcon fontSize="small" /> All</button>
                <button onClick={() => navigate("/categories/checkboxes")}><CheckBoxOutlinedIcon fontSize="small" /> Checkboxes</button>
                <button onClick={() => navigate("/categories/cards")}><NoteOutlinedIcon fontSize="small" /> Cards</button>
            </div>
            <div className="mega-column">
                <button onClick={() => navigate("/categories/buttons")}><SmartButtonOutlinedIcon fontSize="small" /> Buttons</button>
                <button onClick={() => navigate("/categories/text")}><TextFieldsOutlinedIcon fontSize="small" /> Inputs</button>
            </div>
        </div>
    );
};

export default MegaDropdown;
