import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "react-hot-toast";

const deleteProject = async (projectId) => {
  try {
    await api.delete(`/projects/${projectId}/`);
  } catch (error) {
    console.error("Error al borrar el proyecto:", error);

    let errorMessage = "No se pudo eliminar el proyecto.";
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

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      console.error(error.message || "Error al eliminar el proyecto.");
      toast.error(error.message || "Error al eliminar el proyecto.");
    },
    onSuccess: (_, projectId) => {
      toast.success("¡Proyecto eliminado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};