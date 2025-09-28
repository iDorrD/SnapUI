import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const UPDATE_VERSION = "2025.06.07";

function UpdatePopup({ visible, onClose }) {
    const [animatingOut, setAnimatingOut] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        if (visible) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [visible]);

    const closePopup = () => {
        setAnimatingOut(true);
        document.body.classList.remove("no-scroll");
        setTimeout(() => {
            onClose();
            setAnimatingOut(false);
        }, 200);
    };

    const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            closePopup();
        }
    };

    if (!visible && !animatingOut) return null;

    return (
        <div
            style={{
                ...styles.overlay,
                animation: animatingOut ? "fadeOut 0.2s forwards" : "fadeIn 0.2s"
            }}
            onClick={handleClickOutside}
        >
            <div
                ref={popupRef}
                style={{
                    ...styles.popup,
                    animation: animatingOut ? "scaleOut 0.2s forwards" : "scaleIn 0.2s"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={styles.header}>
                    <h2 style={styles.title}>🎉 News</h2>
                    <span style={styles.date}>
                        {UPDATE_VERSION.replace(/(\d{4})\.(\d{2})\.(\d{2})/, "$2/$3/$1")}
                    </span>
                    <button style={styles.close} onClick={closePopup}>×</button>
                </div>

                <div style={styles.content} className="popup-scroll">
                    <img src="/image/final-release.webp" alt="Final Release" style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }} />
                    <p>¡Notas del parche final de curso! Aquí es el listado de las últimas correcciones:</p>
                    <div style={styles.section}>
                        <span style={styles.label("added")}>ADDED</span>
                        <div style={styles.line("#26e98e")} />
                    </div>
                    <ul>
                        <li><strong>Mobile version added</strong>: full compatible with tablets and mobiles.</li>
                        <li><strong>Favorites</strong>: now you can follow and add favorites everything component.</li>
                        <li><strong>Reports</strong>: and now you can&apos;t report equal component</li>

                    </ul>

                    <div style={styles.section}>
                        <span style={styles.label("security")}>SECURITY</span>
                        <div style={styles.line("#3b82f6")} />
                    </div>
                    <ul>
                        <li><strong>Automatic logout</strong>: after 2 hours your account is logout.</li>
                        <li><strong>Fix positions header</strong>: now you can see correctly components.</li>
                    </ul>

                    <p style={{ marginTop: "1rem", color: "#777", fontWeight: "500" }}>
                        Want more? Follow us to stay updated!
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
        boxSizing: "border-box",
        backdropFilter: "blur(5px)",
    },
    popup: {
        backgroundColor: "#121212",
        borderRadius: "12px",
        maxWidth: "520px",
        width: "100%",
        color: "white",
        position: "relative",
        border: "1px solid #2c2f33",
        userSelect: "none",
        overflow: "hidden"
    },
    header: {
        padding: "1rem 1.5rem 0.5rem",
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #2c2f33",
        background: "linear-gradient(135deg, #26e98e22 0%, rgba(38, 233, 142, 0) 100%)",
        paddingBottom: "1rem",
        paddingTop: "1rem",
    },
    title: {
        fontSize: "1.1rem",
        margin: 0,
    },
    date: {
        fontSize: "0.9rem",
        color: "#b9bbbe",
        fontWeight: "500",
    },
    close: {
        position: "absolute",
        top: "1rem",
        right: "1.5rem",
        background: "transparent",
        border: "none",
        fontSize: "1.5rem",
        color: "white",
        cursor: "pointer"
    },
    content: {
        padding: "1rem 1.5rem",
        fontSize: "0.9rem",
        lineHeight: "1.5",
        color: "#b9bbbe",
        maxHeight: "60vh",
        overflowY: "auto"
    },
    section: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginTop: "1.5rem"
    },
    label: (type) => ({
        fontWeight: "bold",
        color: type === "added" ? "#26e98e" : "#3b82f6",
        whiteSpace: "nowrap"
    }),
    line: (color) => ({
        flex: 1,
        height: "1px",
        backgroundColor: color
    }),
};

export default UpdatePopup;

UpdatePopup.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
};