import { Link } from "react-router-dom";

const ErrorNotFound = () => {
    return (
        <div className="error-container">
            <h1 className="error-code">404</h1>
            <p className="error-message">Oops! The page you were looking for doesn’t exist.</p>
            <Link to="/" className="btn-join">← Back to homepage</Link>
        </div>
    );
};

export default ErrorNotFound;
