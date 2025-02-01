import { useQuery } from '@tanstack/react-query';
import api from '../axios';

// Función para obtener un proyecto específico por su ID
const fetchProjectById = async (id) => {
  try {
    const { data } = await api.get(`/${id}`);
    console.log('Proyecto obtenido:', data);
    return data;
  } catch (error) {
    console.error(`Error al obtener el proyecto con ID ${id}:`, error);
    // Manejo de error básico
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message || `Error al obtener el proyecto con ID ${id}.`;
      throw new Error(errorMessage);
    } else {
      throw new Error('Ocurrió un error al intentar obtener el proyecto.');
    }
  }
};

// Hook personalizado para obtener un proyecto por ID
export const useProjectById = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id, // Solo se ejecuta si el ID está definido
    staleTime: 5 * 60 * 1000, // Los datos son válidos por 5 minutos
  });
};