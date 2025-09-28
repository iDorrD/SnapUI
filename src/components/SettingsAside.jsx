import PersonIcon from '@mui/icons-material/Person';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { useLocation, Link } from "react-router-dom";

function SettingsAside() {
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <aside className="settings-sidebar">
            <h3>Settings</h3>
            <ul>
                <li className={isActive("/settings/profile") && !isActive("/settings/avatar") ? "active fw-normal" : "fw-normal"}>
                    <Link to="/settings/profile" className="text-decoration-none text-white-50 fw-normal">
                        <PersonIcon fontSize="small" /> Profile
                    </Link>
                </li>

                <li className={isActive("/settings/avatar") ? "active fw-normal" : "fw-normal"}>
                    <Link to="/settings/avatar" className="text-decoration-none text-white-50 fw-normal">
                        <AccountCircleOutlinedIcon fontSize="small" /> Avatar {/* <span className="new">NEW</span> */}
                    </Link>
                </li>

            </ul>
        </aside>
    );
}


export default SettingsAside