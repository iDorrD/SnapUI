import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUsuario } from "../../services";
import { useNavigate } from "react-router-dom";
// Icons
import PersonIcon from '@mui/icons-material/Person';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import SettingsAside from "../../components/SettingsAside";
/* ------------------ */
function ProfileSettings() {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const { login } = useAuth();

    const [form, setForm] = useState({
        name: "",
        location: "",
        twitter: "",
        bio: "",
    });

    useEffect(() => {
        if (usuario) {
            setForm({
                name: usuario.name || "",
                location: usuario.location || "",
                bio: usuario.descripcion || "",
                preview: usuario.avatar || "",
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name || "");
        formData.append("location", form.location || "");
        formData.append("bio", form.bio || "");

        try {
            const updatedUser = await updateUsuario(formData);
            login(updatedUser);
            navigate(`/profile/${usuario.slug}`);
        } catch (err) {
            console.error("Error al actualizar perfil:", err);
        }
    };



    return (
        <div className="settings-page">
            {/* Menú lateral */}
            <SettingsAside />

            {/* Formulario principal */}
            <main className="settings-content">
                <h2>Personal Information</h2>
                <p className="subtitle">This information will be displayed publicly on your profile.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div>
                            <label><PersonIcon fontSize="small" /> Username</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />

                        </div>
                        <div>
                            <label><LocationOnOutlinedIcon fontSize="small" /> Location</label>
                            <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Your location" />

                        </div>
                    </div>

                    <label style={{ marginTop: "20px" }}><DriveFileRenameOutlineOutlinedIcon fontSize="small" /> Bio</label>
                    <textarea
                        name="bio"
                        rows="4"
                        placeholder="Write a few sentences about yourself"
                        value={form.bio}
                        onChange={handleChange}
                    ></textarea>

                    <div className="form-buttons">
                        <button type="button" className="btn-join" onClick={()=>navigate("/")}>Cancel</button>
                        <button type="submit" className="btn-primary">Save changes</button>
                    </div>

                    {/* <div className="progress-box">
                        <strong>Profile completion</strong>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: "17%" }}></div>
                        </div>
                        <p className="missing">Missing: Location, Company, Twitter, Blog, Bio</p>
                    </div> */}
                </form>
            </main>
        </div>
    );
}

export default ProfileSettings;