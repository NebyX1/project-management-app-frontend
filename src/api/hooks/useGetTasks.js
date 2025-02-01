import { useQuery } from '@tanstack/react-query';
import api from '../axios';

// Función para obtener las tareas filtradas por ID de proyecto
const fetchTasksByProject = async (projectId) => {
  if (!projectId) throw new Error('El ID del proyecto es requerido');
  
  try {
    const { data } = await api.get(`/tasks/?project=${projectId}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener las tareas del proyecto ${projectId}:`, error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `Error al obtener las tareas del proyecto ${projectId}.`);
    } else {
      throw new Error('Ocurrió un error al intentar obtener las tareas.');
    }
  }
};

// Hook personalizado para obtener las tareas de un proyecto específico
export const useGetTasks = (projectId) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasksByProject(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};
