import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsuario, getComponentesByUsuario, isSiguiendoUsuario, followUsuario, unfollowUsuario } from "../services";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import CardComponent from "../components/CardComponent";
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { CalendarMonthOutlined } from "@mui/icons-material";
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import Tooltip from '@mui/material/Tooltip';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';

function Profile() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { usuario: usuarioAuth } = useAuth();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [componentes, setComponentes] = useState([]);

    const esPropietario = usuarioAuth && usuarioAuth.slug === slug;

    useEffect(() => {
        getUsuario(slug)
            .then((data) => {
                setUsuario(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error:", err);
                setLoading(false);
            });
    }, [slug]);

    useEffect(() => {
        getComponentesByUsuario(slug)
            .then((data) => setComponentes(data))
            .catch((err) => {
                console.error("Error cargando componentes del usuario:", err);
            });
    }, [slug]);

    useEffect(() => {
        if (usuario && usuarioAuth && usuarioAuth.id !== usuario.id) {
            isSiguiendoUsuario(usuario.id)
                .then(setIsFollowing)
                .catch(console.error);
        }
    }, [usuario, usuarioAuth]);

    if (loading) return <Loader />;
    if (!usuario) return <Loader />;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src={usuario.avatar || "/image/default_avatar.png"}
                    alt="avatar"
                    className="profile-avatar"
                    draggable="false"
                />
                <div className="profile-info">
                    <h2 style={{ fontSize: "32px", display: "flex", alignItems: "center", gap: "8px" }}>
                        {usuario.name}
                        {usuario.role === "admin" && (
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
                                    fontSize="medium"
                                    className="admin-icon"
                                    style={{ verticalAlign: "middle" }}
                                />
                            </Tooltip>
                        )}
                        {
                            usuario.role === "plus" ?
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
                                    <div className="plus-icon" style={{ verticalAlign: "middle", backgroundColor: "#c062ff33", borderRadius: "50%", padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                    <WorkspacePremiumOutlinedIcon
                                        fontSize="medium"
                                        className="plus-icon"
                                        style={{ verticalAlign: "middle", color: "#c062ff" }}
                                    />
                                    </div>
                                </Tooltip>
                            )
                            : null
                        }
                    </h2>
                    <p className="slug">@{usuario.slug}</p>
                    <p className="bio fw-normal" style={{ color: "gray" }}>{usuario.bio || "No bio available"}</p>
                    {esPropietario
                        ? <button className="btn-join" onClick={() => navigate("/settings/profile")}><AddIcon />Edit Profile</button>
                        : <button
                            className={`btn-join ${isFollowing ? "following" : ""}`}
                            onClick={async () => {
                                try {
                                    if (isFollowing) {
                                        await unfollowUsuario(usuario.id);
                                        setIsFollowing(false);
                                        setUsuario((prev) => ({
                                            ...prev,
                                            followers: prev.followers - 1,
                                        }));
                                    } else {
                                        await followUsuario(usuario.id);
                                        setIsFollowing(true);
                                        setUsuario((prev) => ({
                                            ...prev,
                                            followers: prev.followers + 1,
                                        }));
                                    }
                                } catch (error) {
                                    if (error.message.includes("409")) {
                                        console.warn("Ya sigues a este usuario.");
                                    } else {
                                        console.error("Error en follow/unfollow:", error);
                                    }
                                }
                            }}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </button>
                    }
                    <div className="profile-stats d-flex justify-content-between mt-3 gap-3 align-items-center">
                        <div className="stat-item">
                            <span className="stat-value fw-normal"><CodeOutlinedIcon fontSize="small" /> {componentes.length}</span>
                            <span className="stat-label fw-normal"> Creations</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value fw-normal"><BookmarkOutlinedIcon fontSize="small" /> {usuario.followers}</span>
                            <span className="stat-label fw-normal"> Follower{usuario.followers === 1 ? "" : "s"}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value fw-normal"><CalendarMonthOutlined fontSize="small" /> {new Date(usuario.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-tabs">
                <h5>Latest creations for {usuario.name}</h5>
            </div>

            <hr className="divider" />

            {componentes.length > 0 ? (
                <section className="componentes-grid">
                    {componentes
                        .filter((comp) => comp.estado === "aprobado")
                        .map((comp) => (
                            <CardComponent
                                key={comp.id}
                                id={comp.id}
                                nombre={comp.nombre}
                                usuario={comp.usuario}
                                favoritos={comp.favoritos}
                                codigo_html={comp.codigo_html}
                                codigo_css={comp.codigo_css}
                            />
                        ))}
                </section>
            ) : (
                <div className="profile-empty-state">
                    <div className="empty-icon"> · </div>
                    <h3>No Public Posts Yet</h3>
                    <p>
                        {esPropietario
                            ? "Looks like you haven't made any posts yet. Don’t worry, just click the Create button and let the universe know you’re out there."
                            : "This user hasn’t published any posts yet."}
                    </p>
                    {esPropietario && (
                        <button className="btn-join">
                            <AddIcon /> Create
                        </button>
                    )}
                </div>
            )}

        </div>
    );
}

export default Profile;
