import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';
// import ErrorNotFound from '../pages/ErrorNotFound';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/" replace />;
    }

    if (roles.length > 0 && !roles.includes(usuario.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
};