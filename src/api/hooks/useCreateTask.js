import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "react-hot-toast";

// Función para crear una nueva tarea
const createTask = async (newTask) => {
  try {
    const { data } = await api.post("/tasks/", newTask);
    return data;
  } catch (error) {
    console.error("Error al crear la tarea:", error);

    // Extraer mensaje de error del backend
    let errorMessage = "No se pudo crear la tarea.";
    if (error.response && error.response.data) {
      console.error("Error response data:", error.response.data); // Log de depuración
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

// Hook para crear una tarea
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onError: (error) => {
      console.error(error.message || "Error al crear la tarea.");
      toast.error(error.message || "Error al crear la tarea.");
    },
    onSuccess: () => {
      toast.success("¡Tarea creada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalida la caché para refetch
    },
  });
};
