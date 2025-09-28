import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useEffect, useRef } from "react";

const CardComponent = ({ className = "", id, nombre, usuario, favoritos, codigo_html, codigo_css }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) {
            requestAnimationFrame(() => {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(`
                    <html>
                      <head>
                        <style>
                          * { box-sizing: border-box; }
                          html, body {
                            margin: 0;
                            padding: 0;
                            background: transparent;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100%;
                            width: 100%;
                            overflow: hidden;
                          }
                          body > * {
                            max-width: 100%;
                            max-height: 100%;
                            word-break: break-word;
                            overflow-wrap: break-word;
                          }
                          ${codigo_css}
                        </style>
                      </head>
                      <body>
                        ${codigo_html}
                      </body>
                    </html>
                  `);
                doc.close();
            });
        }
    }, [codigo_html, codigo_css]);
    

    return (
        <Link to={`/component/${id}`} className="card-link">
            <div className={`card ${className}`}>
                <div className="preview">
                    <iframe
                        ref={iframeRef}
                        title={`preview-${id}`}
                        width="100%"
                        height="100%"
                        style={{
                            border: "none",
                            background: "transparent",
                            display: "block",
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                        }}
                    />
                    <div className="preview-overlay" />
                </div>
                <h3 className="card-title">{nombre}</h3>
                <p className="card-creator">@{usuario.slug}</p>
                <hr style={{ margin: 0 }} />
                <div style={{ display: "flex", alignItems: "center", marginTop: "10px", color: "gray" }}>
                    <FavoriteBorderOutlinedIcon fontSize="small" />
                    <small className="card-likes" style={{ marginLeft: "3px" }}>{favoritos}</small>
                </div>
            </div>
        </Link>
    );
};

export default CardComponent;

CardComponent.propTypes = {
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    usuario: PropTypes.shape({
        slug: PropTypes.string.isRequired,
    }).isRequired,
    favoritos: PropTypes.number.isRequired,
    codigo_html: PropTypes.string.isRequired,
    codigo_css: PropTypes.string.isRequired,
    className: PropTypes.string,
};