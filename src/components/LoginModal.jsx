import PropTypes from 'prop-types';
import { useEffect, useRef } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Link } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';

const LoginModal = ({ isOpen, onClose }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, onClose]);

    return (
        <div
            className={`modal-overlay ${isOpen ? "show" : "hide"}`}
            style={{ display: isOpen ? "flex" : "none" }}
        >
            <div ref={modalRef} className={`modal-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Join the Community</h2>
                <p>Create beautiful UI elements and share with developers</p>
                <ul className="modal-benefits" style={{ listStyleType: "none", padding: 0, color: "#ffffff88", fontWeight: 400, fontSize: "14px" }}>
                    <li><DoneIcon fontSize="small" style={{color: "#3b82f6"}} /> Create and share unlimited UI elements</li>
                    <li><DoneIcon fontSize="small" style={{color: "#3b82f6"}} /> Get inspiration from thousands of designs</li>
                    <li><DoneIcon fontSize="small" style={{color: "#3b82f6"}} /> Join a thriving community of creators</li>
                </ul>
                <div className="login-buttons">
                    <button className="btn-auth google"><GoogleIcon fontSize="small"/> Continue with Google</button>
                    <Link to="/register" className="btn-auth text-decoration-none"><EmailOutlinedIcon fontSize="small"/> Continue with Email</Link>
                </div>
                <p className="modal-footer">
                    Already have an account? <Link to="/register">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;

LoginModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};