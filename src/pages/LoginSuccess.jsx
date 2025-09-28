import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginSuccess() {
    const { login } = useAuth();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get("token");
        const name = params.get("name");
        const slug = params.get("slug");
        const avatar = params.get("avatar");
        const role = params.get("role");

        if (token && name && slug) {
            const user = { name, slug, avatar, role };
            login(user, token);
            navigate("/");
        }
    }, []);

    return <p>Logging in...</p>;
}

export default LoginSuccess;
