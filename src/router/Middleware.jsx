import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../store/useAuth";

export const ProtectedRoutes = ({ children }) => {
  const auth = useAuth((state) => state.auth); // Accede al estado de autenticación

  if (!auth?.access) {
    // Verifica si hay un token de acceso en el estado de autenticación
    // Redirige al usuario a la página de login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, muestra el componente hijo (children)
  return children;
};

export const LoginGuard = ({ children }) => {
  const auth = useAuth((state) => state.auth); // Accede al estado de autenticación

  if (auth?.access) {
    // Verifica si hay un token de acceso en el estado de autenticación
    // Redirige al usuario a la página de home si está autenticado
    return <Navigate to="/" replace />;
  }

  // Si el usuario no está autenticado, muestra el componente hijo (children)
  return children;
};