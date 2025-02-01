import { useQuery } from '@tanstack/react-query';
import api from '../axios';

const fetchProject = async (projectId) => {
  if (!projectId) throw new Error('El ID del proyecto es requerido');
  
  try {
    const { data } = await api.get(`/projects/${projectId}/`);
    return data;
  } catch (error) {
    console.error(`Error al obtener el proyecto ${projectId}:`, error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `Error al obtener el proyecto ${projectId}.`);
    } else {
      throw new Error('Ocurrió un error al intentar obtener el proyecto.');
    }
  }
};

export const useGetProject = (projectId) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};