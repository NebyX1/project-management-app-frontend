import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  // React Query 5: Llamamos useMutation pasando un objeto de opciones
  const {
    mutate,
    data,
    error,
    isError,
    isIdle,
    isPending,
    isPaused,
    isSuccess,
    failureCount,
    failureReason,
    reset,
    status,
    submittedAt,
    variables,
  } = useMutation({
    // 1) Esta es la función de la mutación (lo que hace la llamada PATCH)
    mutationFn: async ({ taskId, updates }) => {
      const { data } = await api.patch(`/tasks/${taskId}/`, updates);
      return data; // Respuesta del servidor
    },

    // 2) onSuccess -> Se ejecuta cuando la mutación termina con éxito
    onSuccess: (updatedTask, variables) => {
      // updatedTask es la respuesta devuelta por el servidor
      queryClient.invalidateQueries(['tasks', variables.projectId]);
    },

    // 3) Manejo de error, retry, etc. (opcional)
    onError: (error, variables) => {
      console.error('Error actualizando la tarea:', error);
    },
    retry: 0,
  });

  // Mutate es la función que llamaremos para disparar la actualización
  return {
    mutate,
    data,
    error,
    isError,
    isIdle,
    isPending,
    isPaused,
    isSuccess,
    failureCount,
    failureReason,
    reset,
    status,
    submittedAt,
    variables,
  };
}
