import React from 'react';
import useRole from '../Hooks/useRole';
import { Navigate } from 'react-router-dom';

const BuyerRouter = ({ children }) => {
    const [role, isLoading] = useRole();
    const savedRole = localStorage.getItem("sinex_user_role");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-ring loading-lg text-[#00d7c0]"></span>
            </div>
        );
    }

    if (role === 'Buyer' || savedRole === 'Buyer') {
        return children;
    }

    return <Navigate to="/dashboard" replace />;
};

export default BuyerRouter;