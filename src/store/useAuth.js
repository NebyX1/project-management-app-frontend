import { persist } from 'zustand/middleware';
import { create } from 'zustand';

const useAuth = create(
  persist(
    (set) => ({
      auth: undefined, // Estado inicial sin autenticación.
      login: (authData) => set({ auth: authData }),
      logout: () => {
        set({ auth: undefined }); // Actualiza el estado a indefinido
        localStorage.removeItem('auth-store'); // Elimina la clave 'auth-store' del localStorage
	      window.location.href = "/login";
      },
    }),
    {
      name: 'auth-store', // El nombre de la clave en el localStorage
    }
  )
);

export default useAuth;