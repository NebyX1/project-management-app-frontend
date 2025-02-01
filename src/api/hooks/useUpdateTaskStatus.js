import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

/**
 * Hook personalizado para actualizar el status de una tarea
 * @returns mutate: función para actualizar
 */
export const useUpdateTaskStatus = () => {
  // queryClient nos deja invalidar/actualizar la caché local de React Query
  const queryClient = useQueryClient();

  /**
   * La mutación:
   * - Recibe un objeto { taskId, newStatus }
   * - Hace un PATCH a /tasks/{taskId}/
   * - Retorna la data resultante (la tarea ya actualizada)
   */
  return useMutation(
    async ({ taskId, newStatus }) => {
      // Ajusta la ruta si en tu backend es distinto (p.e. /tasks/{id}/)
      const { data } = await api.patch(`/tasks/${taskId}/`, {
        status: newStatus
      });
      return data;
    },
    {
      // onSuccess se ejecuta cuando la mutación terminó bien
      onSuccess: (updatedTask, variables) => {
        queryClient.invalidateQueries(["tasks"]);
      },
    }
  );
};
