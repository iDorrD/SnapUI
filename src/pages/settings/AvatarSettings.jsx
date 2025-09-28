import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateAvatar } from "../../services";
import { useNavigate } from "react-router-dom";
// Icons
import { toast } from "react-hot-toast";
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SettingsAside from "../../components/SettingsAside";
/* ------------------ */
function AvatarSettings() {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const { login } = useAuth();
    const [imageFile, setImageFile] = useState(null);


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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("The image size must be less than 2MB.");
                return;
            }

            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => ({ ...prev, preview: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (imageFile) {
            formData.append("avatar", imageFile);
        }


        if (imageFile) {
            formData.append("avatar", imageFile);
        }

        try {
            const updatedUser = await updateAvatar(formData);
            login(updatedUser);
            toast.success("Avatar updated successfully!");
            navigate(`/profile/${usuario.slug}`);
        } catch (err) {
            console.error("Error al actualizar perfil:", err);
            toast.error("Error updating avatar. Please try again.");
        }
    };


    return (
        <div className="settings-page">
            {/* Menú lateral */}
            <SettingsAside />

            {/* Formulario principal */}
            <main className="settings-content">
                <h2>Avatar Custom</h2>
                <p className="subtitle">Customize your avatar and the rest of the world will see it.</p>

                <form onSubmit={handleSubmit}>

                    <div className="rules-avatar">
                        <h5><GavelOutlinedIcon fontSize="small" /> Rules</h5>
                        <hr />
                        <p>Image must be less than 2MB</p>
                        <p>Image must be square (1:1 ratio)</p>
                        <p>No content NSFW</p>
                    </div>

                    <div className="avatar-section d-flex flex-row align-items-center justify-content-center">
                        <img
                            src={form.preview || form.avatar || "/image/default_avatar.png"}
                            alt="Avatar"
                            className="settings-avatar"
                        />

                        <label htmlFor="avatar-upload" className="upload-button">
                            Cambiar imagen
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => handleImageChange(e)}
                            style={{ display: "none" }}
                        />
                    </div>


                    <div className="form-buttons">
                        <button type="button" className="btn-join" onClick={()=>navigate("/")}>Cancel</button>
                        <button type="submit" className="btn-primary">Save changes</button>
                    </div>

                </form>
            </main>
        </div>
    );
}

export default AvatarSettings;
