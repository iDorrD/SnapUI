import logo from "/image/snapui_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginUsuario } from "../services";
import { useAuth } from "../contexts/AuthContext";


function Login() {
    const { login, usuario } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await loginUsuario({
                email: form.email,
                password: form.password,
            });
            login(data.user, data.access_token);
            navigate("/");
        } catch (err) {
            let msg = "Something went wrong";
            try {
                const parsed = JSON.parse(err.message);
                if (parsed && typeof parsed === "object") {
                    const errores = Object.values(parsed).flat();
                    msg = errores.join(" ");
                } else {
                    msg = err.message;
                }
            } catch {
                msg = err.message;
            }

            setError(msg);
        }
    };

    useEffect(() => {
        if (usuario) navigate("/");
    }, [usuario]);

    useEffect(() => {
        document.body.classList.remove("login-page"); // ya no usamos fondo
    }, []);

    return (
        <div className="register-page" style={{ background: "#0b0b0b" }}>
            <img src={logo} alt="SnapUI" className="register-logo" />

            <div className="register-box">

                <h2>Sign in to your SnapUI account</h2>

                <form className="register-form" onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        minLength={6}
                    />

                    <button type="submit">Sign in</button>
                </form>

                <p className="redirect-login">
                    Don&apos;t have an account? <Link to="/register">Create one</Link>
                </p>

                {error && <p className="form-error text-center">{error}</p>}
            </div>
        </div>
    );
}

export default Login;
