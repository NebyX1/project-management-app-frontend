import { useMutation } from "@tanstack/react-query";
import api from '../axios';

const loginUser = async (user) => {
  try {
    const { data } = await api.post("/login/", user);
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Credenciales incorrectas");
    }
    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.message || "Datos inválidos";
      throw new Error(errorMessage);
    }
    throw new Error("Error de conexión con el servidor");
  }
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};