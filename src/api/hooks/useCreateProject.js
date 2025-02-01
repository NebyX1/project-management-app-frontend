import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "react-hot-toast";

// Función para crear un nuevo proyecto
const createProject = async (newProject) => {
  try {
    const { data } = await api.post("/projects/", newProject);
    return data;
  } catch (error) {
    console.error("Error al crear el proyecto:", error);

    let errorMessage = "No se pudo crear el proyecto.";
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

    throw new Error(errorMessage);
  }
};

// Hook para crear un proyecto
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onError: (error) => {
      console.error(error.message || "Error al crear el proyecto.");
      toast.error(error.message || "Error al crear el proyecto.");
    },
    onSuccess: () => {
      toast.success("¡Proyecto creado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Invalida la caché para refetch
    },
  });
};
