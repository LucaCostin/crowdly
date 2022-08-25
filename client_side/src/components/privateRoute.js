import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => ({ ...state.auth }));
    const navigate = useNavigate();

    return !user ? children : navigate('/')
}

export default PrivateRoute