import logo from "/image/snapui_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { registrarUsuario, verificarSlug } from "../services";
import { useAuth } from "../contexts/AuthContext";

function Register() {
    const { login, usuario } = useAuth();
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [form, setForm] = useState({ email: "", username: "", password: "" });
    const [error, setError] = useState(null);
    const [slugOcupado, setSlugOcupado] = useState(false);
    const [forzarRegistro, setForzarRegistro] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (usuario) navigate("/");
    }, [usuario, navigate]);

    useEffect(() => {
        document.body.classList.remove("login-page");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await registrarUsuario({
                name: form.username,
                email: form.email,
                password: form.password,
            });

            login(data.user, data.access_token);
            navigate("/");
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };


    const handleUsernameChange = async (value) => {
        setForm({ ...form, username: value });
        setSlugOcupado(false);
        setForzarRegistro(false);
        if (value.trim().length >= 3) {
            const existe = await verificarSlug(value.trim().toLowerCase());
            setSlugOcupado(existe);
        }
    };

    return (
        <div className="register-page" style={{ background: "#0b0b0b" }}>
            <img src={logo} alt="SnapUI" className="register-logo" />

            <div className="register-box">

                <h2>Sign up for SnapUI</h2>

                <form className="register-form" onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        onFocus={() => setIsUsernameFocused(true)}
                        onBlur={() => setIsUsernameFocused(false)}
                        max={255}
                        required
                    />
                    {slugOcupado && !forzarRegistro && (
                        <div className="form-error">
                            This username is already taken. If you skip this warning, you will be registered with a random username. Ej: &quot;{form.username}_1234&quot;.
                        </div>
                    )}


                    <CSSTransition
                        in={isUsernameFocused}
                        timeout={200}
                        classNames="description"
                        unmountOnExit
                    >
                        <p className="input-description">
                            This is how other users will see you. You can use special characters and emojis.
                        </p>
                    </CSSTransition>

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        minLength={6}
                        required
                    />

                    <button type="submit">Create Account</button>

                    <div className="terms">
                        <input type="checkbox" required />
                        <span>
                            I have read and agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                        </span>
                    </div>
                </form>

                <p className="redirect-login">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
                {error && <p className="form-error text-center">{error}</p>}
            </div>
        </div>
    );
}

export default Register;
