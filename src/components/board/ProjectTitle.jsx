import React from "react";
import { useGetProject } from "../../api/hooks/useGetProject";

export default function ProjectTitle({ projectId }) {
  // Llamamos useGetProject aquí, en un componente separado
  const { data, isLoading, isError, error } = useGetProject(projectId);

  if (isLoading) {
    return (
      <h1 className="text-center text-2xl font-bold text-gray-600 mb-4">
        Cargando nombre del proyecto...
      </h1>
    );
  }

  if (isError) {
    return (
      <h1 className="text-center text-2xl font-bold text-red-600 mb-4">
        Error al cargar proyecto: {error?.message}
      </h1>
    );
  }

  // data es el proyecto
  const projectName = data?.name || "Sin Nombre";

  return (
    <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-6 tracking-wide drop-shadow-sm">
      Proyecto: <span className="text-blue-600">{projectName}</span>
    </h1>
  );
}
