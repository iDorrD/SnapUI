import { Container } from "@mui/material";

const Footer = () => {
    return (
        <footer className="footer">
            <Container className="footer-container">
                <div className="footer-brand">
                    <img src="/image/snapui_logo.png" alt="SnapUI Logo" className="footer-logo" width={"120px"} />
                    <p>
                        SnapUI is <span className="highlight">a school project</span>.
                        <br />
                        © 2025 SnapUI.
                    </p>
                </div>

            </Container>
            <p className="footer-disclaimer">
                NOT APPROVED BY OR ASSOCIATED WITH ANY MAJOR DESIGN SYSTEM. SNAPUI IS A SCHOOL PROJECT AND IS NOT INTENDED FOR COMMERCIAL USE. <br/>ALL TRADEMARKS AND COPYRIGHTS ARE THE PROPERTY OF THEIR RESPECTIVE OWNERS.
            </p>
        </footer>
    );
};

export default Footer;
