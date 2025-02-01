import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "react-hot-toast";

// Función para archivar un proyecto por su ID
const updateProject = async (projectId) => {
  try {
    const { data } = await api.patch(`/projects/${projectId}/`, {
      active: false
    });
    return data;
  } catch (error) {
    console.error("Error al archivar el proyecto:", error);

    let errorMessage = "No se pudo archivar el proyecto.";
    if (error.response && error.response.data) {
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

// Hook para archivar un proyecto
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      console.error(error.message || "Error al archivar el proyecto.");
      toast.error(error.message || "Error al archivar el proyecto.");
    },
    onSuccess: (_, projectId) => {
      toast.success("¡Proyecto archivado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};