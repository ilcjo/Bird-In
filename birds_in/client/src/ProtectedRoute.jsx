import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import { clearToken } from './redux/slices/Auth';

export const ProtectedRoute = ({ element, roles, children }) => {
    const isAuthenticated = localStorage.getItem('token');
    const userRole = localStorage.getItem('tipoCliente')
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!isAuthenticated && token) {
            // Aquí podrías realizar una validación adicional para comprobar si el token es válido
            // Por ejemplo, podrías hacer una llamada al servidor para verificar el token
            // Si el token no es válido, podrías despejar el token almacenado en el almacenamiento local y desautenticar al usuario
            // Si no estás realizando una validación adicional, simplemente despeja el token almacenado en el almacenamiento local
            localStorage.removeItem('token');
            dispatch(clearToken());
        }
    }, [isAuthenticated, dispatch]);

    if (isAuthenticated && roles.includes(userRole)) {
        return children;
    } else {
        return <Navigate to="/" />;
    }
};
