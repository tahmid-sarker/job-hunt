import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserRoutes = ({children}) => {
    const { user } = useAuth();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/users`, {
            withCredentials: true
        })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const roledUser = users.find(u => u.email === user?.email);

    if (loading) {
        return (
            <div className="flex place-content-center items-center h-screen gap-2">
                <span className="loading loading-dots loading-xs text-primary"></span>
                <span className="loading loading-dots loading-sm text-primary"></span>
                <span className="loading loading-dots loading-md text-primary"></span>
                <span className="loading loading-dots loading-lg text-primary"></span>
                <span className="loading loading-dots loading-xl text-primary"></span>
            </div>
        );
    }

    if (roledUser.role !== 'user') {
        return <Navigate state={location?.pathname} to='/' />;;
    }
    return children;
};

export default UserRoutes;