import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginModal from "./LoginModal";
import CreateModal from "./CreateModal";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import NotificationCenter from "./NotificationCenter";
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import UpdatePopup from "./UpdatePopup";
import MegaDropdown from "./MegaDropdown";

const Header = () => {
    const nav = useNavigate();
    const { usuario, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="navbar">
                <div className="navbar-left">
                    <div className="navbar-logo">
                        <a href="/" className="logo-link">
                            <img src="/image/snapui_logo.png" alt="SnapUI Logo" className="logo" />
                        </a>
                    </div>
                    <ul className="navbar-menu">
                        <li className="mega-wrapper">
                            <div
                                onMouseEnter={() => setShowMegaMenu(true)}
                                onMouseLeave={() => setShowMegaMenu(false)}
                            >
                                <Link to="/components" className="mega-link">
                                    Components <KeyboardArrowDownIcon />
                                </Link>
                                <MegaDropdown visible={showMegaMenu} />
                            </div>
                        </li>
                        <li><Link to="/ranking">Ranking</Link></li>
                    </ul>
                </div>

                <div className="navbar-actions">
                    {
                        usuario ? (
                            <button className="btn-create" onClick={() => setCreateOpen(true)}>
                                <AddIcon fontSize="small" /> Create
                            </button>
                        ) : (
                            <button className="btn-create" onClick={() => nav("/login")}>
                                <AddIcon fontSize="small" /> Create
                            </button>
                        )
                    }
                    {usuario && <NotificationCenter />}


                    <CreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />

                    {usuario ? (
                        <div className="user-menu-wrapper" ref={menuRef}>
                            <div
                                className="user-button"
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                <KeyboardArrowDownIcon fontSize="small" />
                                <span>{usuario.slug}</span>
                                <img
                                    src={usuario.avatar || "/image/default_avatar.png"}
                                    alt="avatar"
                                    className="user-avatar"
                                    draggable="false"
                                />
                            </div>
                            {isMenuOpen && (
                                <ul className="user-dropdown">
                                    <li><a href={`/profile/${usuario.slug}`}><PermIdentityOutlinedIcon fontSize="small" style={{ marginRight: "3px" }} /> Profile</a></li>
                                    <li><Link to="/settings/profile"><SettingsOutlinedIcon fontSize="small" style={{ marginRight: "7px" }} />Settings </Link></li>

                                    <hr className="dropdown-divider" />
                                    <li><Link to="/dashboard/projects"><AutoAwesomeMosaicOutlinedIcon fontSize="small" style={{ marginRight: "7px" }} />Components </Link></li>
                                    <li onClick={() => setShowChangelog(true)}>
                                        <CampaignOutlinedIcon fontSize="small" style={{ marginRight: "7px" }} />
                                        Changelog
                                    </li>
                                    {
                                        usuario.role === "admin" && (
                                            <>
                                                <hr className="dropdown-divider" />
                                                <li style={{ color: '#ff5050' }}><Link to="/admin" ><AdminPanelSettingsOutlinedIcon fontSize="small" style={{ marginRight: "7px", color: 'ff5050' }} />Admin Dashboard</Link></li>
                                            </>

                                        )
                                    }
                                    <hr className="dropdown-divider" />
                                    <li onClick={logout}><LogoutIcon fontSize="small" style={{ marginRight: "7px" }} />Log out</li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <button className="btn-join" onClick={() => nav("/login")}>
                            <PermIdentityOutlinedIcon fontSize="medium" /> Log in
                        </button>
                    )}
                </div>

                <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                {showChangelog && (
                    <UpdatePopup
                        key={Date.now()}
                        forceOpen={true}
                        onClose={() => setShowChangelog(false)}
                    />
                )}
            </header>
            <UpdatePopup visible={showChangelog} onClose={() => setShowChangelog(false)} />
        </>
    );
};

export default Header;
