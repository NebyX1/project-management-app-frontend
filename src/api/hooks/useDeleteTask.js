import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "react-hot-toast";

// Función para borrar una tarea por su ID
const deleteTask = async (taskId) => {
  try {
    await api.delete(`/tasks/${taskId}/`);
  } catch (error) {
    console.error("Error al borrar la tarea:", error);

    // Extraer mensaje de error del backend
    let errorMessage = "No se pudo eliminar la tarea.";
    if (error.response && error.response.data) {
      console.error("Error response data:", error.response.data);
      const data = error.response.data;
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (data.non_field_errors) {
        errorMessage = data.non_field_errors.join(", ");
      } else {
        errorMessage = Object.values(data).flat().join(", ");
      }
    }

    // Lanza el error con el mensaje obtenido
    throw new Error(errorMessage);
  }
};

// Hook para borrar una tarea
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onError: (error) => {
      console.error(error.message || "Error al eliminar la tarea.");
      toast.error(error.message || "Error al eliminar la tarea.");
    },
    onSuccess: (_, taskId) => {
      toast.success("¡Tarea eliminada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalida la caché para actualizar la lista
    },
  });
};
