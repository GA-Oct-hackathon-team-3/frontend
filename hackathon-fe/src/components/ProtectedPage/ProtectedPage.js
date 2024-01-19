import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

const ProtectedPage = ({ children }) => {
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        if (!token) navigate('/');
    }, [token]);

    return token ? children : null;
};

export default ProtectedPage;
