import { useQuery } from '@tanstack/react-query';
import api from '../axios';

// Función para obtener los proyectos desde el servidor
const fetchProjects = async () => {
  try {
    const { data } = await api.get('/projects/');
    return data;
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message || 'Error al obtener los proyectos.';
      throw new Error(errorMessage);
    } else {
      throw new Error('Ocurrió un error al intentar obtener los proyectos.');
    }
  }
};

// Hook personalizado para obtener los proyectos
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // Los datos son válidos por 5 minutos
  });
};
