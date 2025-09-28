import { useParams, useNavigate, Link } from "react-router-dom";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { getComponentes, getComentarios, publicarComentario, enviarReporte, toggleFavorito, isFavorito, isReportado } from "../services";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Container } from "@mui/material";
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import { Editor } from "@monaco-editor/react";
import { useAuth } from "../contexts/AuthContext";
import ErrorNotFound from "../pages/ErrorNotFound";
import Loader from "../components/Loader";
import SendIcon from '@mui/icons-material/Send';
import ReportModal from "../components/ReportModal";
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import Tooltip from '@mui/material/Tooltip';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast } from "react-hot-toast";
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';

function Componente() {
    const { usuario } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [componente, setComponente] = useState(null);
    const [activeTab, setActiveTab] = useState("css");
    const [codigoVisible, setCodigoVisible] = useState("");
    const [expand, setExpand] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const iframeRef = useRef(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const [esFavorito, setEsFavorito] = useState(false);

    useEffect(() => {
        if (componente?.nombre) {
            document.title = `${componente.nombre} | SnapUI`;
        }
    }, [componente]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "html") {
            setCodigoVisible(componente.codigo_html);
        } else if (tab === "css") {
            setCodigoVisible(componente.codigo_css);
        }
    };

    useEffect(() => {
        if (componente) {
            setCodigoVisible(
                activeTab === "html" ? componente.codigo_html : componente.codigo_css
            );
        }
    }, [componente, activeTab]);

    useEffect(() => {
        if (!iframeRef.current || !componente) return;

        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        const html = activeTab === "html" ? codigoVisible : componente.codigo_html;
        const css = activeTab === "css" ? codigoVisible : componente.codigo_css;

        doc.open();
        doc.write(`
            <html>
            <head>
                <style>${css}</style>
            </head>
            <body style="margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; height: 100vh;user-select: none;">
                ${html}
            </body>
            </html>
        `);
        doc.close();
    }, [codigoVisible, activeTab, componente]);


    useEffect(() => {
        getComponentes().then((componentes) => {
            const encontrado = componentes.find((c) => c.id === parseInt(id));
            setComponente(encontrado);
        });
    }, [id]);

    useEffect(() => {
        if (componente?.id && usuario) {
            getComentarios(componente.id)
                .then(setComentarios)
                .catch(console.error);
        }
    }, [componente, usuario]);

    // Favoritos
    useEffect(() => {
        if (usuario && componente?.id) {
            isFavorito(componente.id)
                .then(setEsFavorito)
                .catch(console.error);
        }
    }, [usuario, componente]);

    const handleToggleFavorito = async () => {
        try {
            const res = await toggleFavorito(componente.id);
            setEsFavorito(res.favorito);
            setComponente(prev => ({ ...prev, favoritos: res.total }));

            // Mostrar toast
            if (res.favorito) {
                toast("Favorite added", { icon: <FavoriteIcon fontSize="small" /> });
            } else {
                toast.error("Favorite removed");
            }
        } catch (error) {
            console.error("Error al marcar favorito:", error);
            toast.error("Could not update favorite");
        }
    };

    const handleComentar = () => {
        if (!nuevoComentario.trim()) return;
        publicarComentario(componente.id, nuevoComentario)
            .then((comentario) => {
                setComentarios((prev) => [comentario, ...prev]);
                setNuevoComentario("");
            })
            .catch(console.error);
    };

    const handleReportar = async (motivo) => {
        try {
            await enviarReporte({
                componente_id: componente.id,
                motivo
            });
        } catch (error) {
            console.error("Error al reportar:", error);
        }
    };

    if (!componente) return <Loader />;

    // lógica de acceso
    const esPropietario = usuario && componente.usuario?.id === usuario.id;
    const esAdmin = usuario && usuario.role === "admin";

    if (componente.estado !== "aprobado" && !esPropietario && !esAdmin) {
        return (
            <ErrorNotFound />
        );
    }

    return (
        <>
            <Container className="container">
                {
                    componente.estado === "pendiente" && (
                        <div className="alert alert-warning mt-5">
                            <strong>Pending Approval</strong> - This component is pending approval by an administrator. You can still view it, but it may not be publicly available yet.
                        </div>
                    )
                }
                {
                    componente.estado === "rechazado" && (
                        <div className="alert alert-danger mt-5">
                            <strong>Rejected</strong> - This component has been rejected by an administrator. You can view it, but it will not be publicly available.
                        </div>
                    )
                }
                <div className="componente-page">
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", justifyContent: "space-between" }}>
                        <button className="btn-join" onClick={() => navigate(-1)}>← Go back</button>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "gray" }}>
                            <span style={{ color: 'gray' }}>Component by <span style={{ color: "white" }}><Link to={`/profile/${componente.usuario.slug}`} style={{ color: "white" }}> {componente.usuario.name}</Link></span></span>
                            <span style={{ color: 'gray' }}>•</span>
                            <FavoriteBorderOutlinedIcon fontSize="small" />
                            <span style={{ color: 'gray' }}>{componente.favoritos}</span>
                        </div>
                    </div>

                    <div className="componente-container" style={{ display: "flex", gap: "20px" }}>
                        <div className="preview-box" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <iframe
                                ref={iframeRef}
                                title="preview"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                    background: "transparent",
                                }}
                                srcDoc={`<html>
                            <head>
                            <style>
                                html, body {
                                margin: 0;
                                padding: 0;
                                background: transparent;
                                width: 100%;
                                height: 100%;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                }
                              body > * {
                                max-width: 100%;
                                max-height: 100%;
                                }
                                ${componente.codigo_css}
                            </style>
                            </head>
                            <body>
                            ${componente.codigo_html}
                            </body>
                        </html>`}
                            />


                        </div>

                        <div className="code-box">
                            <div className="tabs">
                                <button
                                    className={activeTab === "html" ? "active" : ""}
                                    onClick={() => handleTabChange("html")}
                                >
                                    <HtmlIcon fontSize="large" />
                                </button>
                                <button
                                    className={activeTab === "css" ? "active" : ""}
                                    onClick={() => handleTabChange("css")}
                                >
                                    <CssIcon fontSize="large" />
                                </button>
                            </div>

                            <Editor
                                language={activeTab}
                                value={codigoVisible}
                                theme="vs-dark"
                                onChange={(value) => setCodigoVisible(value)}
                                height="650px"
                                options={{
                                    readOnly: false,
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    wordWrap: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    lineNumbers: "on",
                                    folding: false,
                                    lineNumbersMinChars: 4,
                                    lineDecorationsWidth: 10,
                                    lineHeight: 20,
                                    scrollbar: {
                                        vertical: "auto",
                                        horizontal: "auto",
                                        verticalScrollbarSize: 8,
                                        horizontalScrollbarSize: 8,
                                    },
                                    overviewRulerBorder: false,
                                    fixedOverflowWidgets: true,
                                    colorDecorators: true,
                                }}
                            />

                        </div>
                    </div>

                    <div className="componente-actions gap-3">
                        {usuario ? (
                            <button onClick={handleToggleFavorito} className="btn-join">
                                {esFavorito ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderOutlinedIcon fontSize="small" />}
                                {componente.favoritos}
                            </button>
                        )
                            :
                            (
                                <button onClick={() => navigate("/login")} className="btn-join">
                                    <FavoriteBorderOutlinedIcon fontSize="small" />
                                    {componente.favoritos}
                                </button>
                            )}
                        <div style={{ width: "2px", backgroundColor: "#ffffff22" }}></div>
                        <button className="btn-join" onClick={() => setExpand(true)}>
                            <OpenInFullOutlinedIcon fontSize="small" /> Expand
                        </button>
                        <button className="btn-join" onClick={() => setShowExportModal(true)}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={15} style={{ userSelect: "none" }} draggable="false" />
                            Export to React
                        </button>
                        {
                            usuario && usuario.role === "admin" && (
                                <>
                                    <div style={{ width: "2px", backgroundColor: "#ffffff22" }}></div>
                                    <button className="btn-danger" onClick={() => navigate(`/admin?edit=${componente.id}`)}>
                                        <span>Edit with Administrador</span>
                                    </button>
                                </>
                            )
                        }

                    </div>

                    <div className="componente-extra">
                        <div className="left-panel">
                            <h3>Comments</h3>
                            {
                                componente.estado !== "aprobado" ?
                                    (
                                        <div className="comment-box">
                                            <input
                                                type="text"
                                                placeholder="Your comment is pending approval"
                                                disabled
                                            />
                                            <button onClick={handleComentar} disabled className="disabled">
                                                <SendIcon fontSize="small" />
                                            </button>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className="comment-box">
                                            <input
                                                type="text"
                                                placeholder={usuario ? "Send a comment..." : "Log in to comment"}
                                                value={nuevoComentario}
                                                onChange={(e) => setNuevoComentario(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleComentar()}
                                                disabled={!usuario}
                                            />
                                            <button onClick={handleComentar} disabled={!usuario || !nuevoComentario.trim()} className={!usuario || !nuevoComentario.trim() ? "disabled" : ""}>
                                                <SendIcon fontSize="small" />
                                            </button>
                                        </div>
                                    )
                            }

                            {
                                componente.estado !== "aprobado" ? (
                                    <div className="variations-box">
                                        <p>The comments is hidden because your component not is approved</p>
                                    </div>
                                ) : (
                                    <ul className="comments-list">
                                        {comentarios.map((c) => (
                                            <li key={c.id} className="comment">
                                                <img src={c.usuario.avatar || "/image/default_avatar.png"} alt="avatar" />
                                                <div>
                                                    <p className="fw-normal" style={{ color: "gray" }}>{new Date(c.created_at).toLocaleDateString()} {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <strong>
                                                        <Link to={`/profile/${c.usuario.slug}`} style={{ color: "white" }}>
                                                            {c.usuario.name}
                                                        </Link>
                                                    </strong>
                                                    <p className="fw-normal">{c.contenido}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            }

                        </div>

                        <div className="right-panel">
                            <div className="title">
                                <h4>{componente.nombre}</h4>
                            </div>
                            <div className="meta d-flex align-items-center justify-content-between">
                                <span>{new Date(componente.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                {
                                    usuario ? (
                                        <button
                                            style={{ width: "30px", borderRadius: "25px", height: "30px", padding: "0" }}
                                            className="btn-danger"
                                            onClick={async () => {
                                                try {
                                                    const yaReportado = await isReportado(componente.id);
                                                    if (yaReportado) {
                                                        toast.error("Ya has reportado este componente.");
                                                    } else {
                                                        setShowReportModal(true);
                                                    }
                                                } catch (err) {
                                                    console.error(err);
                                                    toast.error("Error al comprobar el reporte.");
                                                }
                                            }}
                                        >
                                            <OutlinedFlagOutlinedIcon style={{ fontSize: "18px" }} fontSize="small"></OutlinedFlagOutlinedIcon>
                                        </button>

                                    ) : (
                                        null
                                    )
                                }
                            </div>

                            <div className="author">
                                <Link to={`/profile/${componente.usuario.slug}`} className="author-link author">
                                    <img src={componente.usuario.avatar || "/image/default_avatar.png"} alt="avatar" />
                                    <div>
                                        <strong className="text-white">
                                            {componente.usuario?.name}
                                            {componente.usuario?.role === "admin" && (
                                                <Tooltip
                                                    title="Administrator"
                                                    componentsProps={{
                                                        tooltip: {
                                                            sx: {
                                                                bgcolor: "#1e1e2f", // fondo oscuro
                                                                color: "#fff",
                                                                fontSize: "0.75rem",
                                                                padding: "6px 10px",
                                                                borderRadius: "8px",
                                                                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                                                                fontFamily: "'Inter', sans-serif",
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <BuildCircleIcon
                                                        fontSize="small"
                                                        className="admin-icon"
                                                        style={{ verticalAlign: "middle", marginLeft: "5px" }}
                                                    />
                                                </Tooltip>
                                            )}
                                            {
                                                usuario && usuario.role === "plus" ?
                                                    (
                                                        <Tooltip
                                                            title="SnapUI Plus"
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        bgcolor: "#1e1e2f", // fondo oscuro
                                                                        color: "#fff",
                                                                        fontSize: "0.75rem",
                                                                        padding: "6px 10px",
                                                                        borderRadius: "8px",
                                                                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                                                                        fontFamily: "'Inter', sans-serif",
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <div className="plus-icon" style={{ verticalAlign: "middle", backgroundColor: "#c062ff33", borderRadius: "50%", padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: "5px" }}>
                                                                <WorkspacePremiumOutlinedIcon
                                                                    fontSize="small"
                                                                    className="plus-icon"
                                                                    style={{ verticalAlign: "middle", color: "#c062ff" }}
                                                                />
                                                            </div>
                                                        </Tooltip>
                                                    )
                                                    : null
                                            }
                                        </strong>
                                        <p>
                                            <small>@{componente.usuario?.slug}</small>
                                        </p>
                                    </div>

                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {expand && (
                    <div className="fullscreen-modal">
                        <button className="close-button" onClick={() => setExpand(false)}>×</button>
                        <div className="fullscreen-content">
                            <iframe
                                title="preview"
                                width="100%"
                                height="100%"
                                style={{ border: "none", background: "transparent" }}
                                srcDoc={`
                                <style>
                                    html, body {
                                    margin: 0;
                                    padding: 0;
                                    background: transparent;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100%;
                                    }
                                    ${componente.codigo_css}
                                </style>
                                ${componente.codigo_html}
                                `}
                            />
                        </div>
                    </div>
                )}
                {showExportModal && (
                    <div className="fullscreen-modal export-modal">
                        <button className="close-button" onClick={() => setShowExportModal(false)}>×</button>
                        <div className="export-modal-content">
                            <h4><img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={25} style={{ userSelect: "none" }} draggable="false" /> React</h4>
                            <p style={{ fontWeight: 300 }}>This snippet is using <a target="_blank" href="https://styled-components.com/" style={{ fontWeight: 400, textDecoration: "underline" }}>styled-components</a>. Install it with <code>npm i styled-components</code>.</p>
                            <pre className="export-box" style={{ paddingBottom: "35px", overflow: "hidden" }}>
                                <code>
                                    {`npm i styled-components`}
                                </code>
                            </pre>
                            <pre className="export-box">
                                <code>
                                    {`import styled from "styled-components";

const StyledComponent = styled.div\`
${componente.codigo_css.trim()}
\`;

const MiComponente = () => {
    return (
    <StyledComponent>
        ${componente.codigo_html
                                            .replace(/class=/g, "className=")
                                            .replace(/for=/g, "htmlFor=")
                                            .split("\n")
                                            .map(line => "      " + line)
                                            .join("\n")}
    </StyledComponent>
    );
};
export default MiComponente;
`}
                                </code>
                            </pre>
                        </div>
                    </div>
                )}

            </Container>
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReportar}
            />


        </>
    );
}

export default Componente;
