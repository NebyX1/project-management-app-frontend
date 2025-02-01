import React from "react";
import { useProjects } from "../api/hooks/useProjects";
import ArchivedProjectCard from "../components/projects/ArchivedProjectCard";
import { FiArchive, FiLoader } from "react-icons/fi";

const ArchivedProjects = () => {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <FiLoader className="w-6 h-6 animate-spin" />
          <span className="text-lg">Cargando proyectos archivados...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">
          Error al cargar los proyectos archivados.
        </div>
      </div>
    );
  }

  const archivedProjects = projects
    .filter((project) => !project.active)
    .sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiArchive className="text-blue-600" />
            Proyectos Archivados
          </h1>
        </div>

        {archivedProjects.length === 0 ? (
          <div className="bg-white border-l-4 border-blue-400 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiArchive className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-lg text-gray-700">
                  No hay proyectos archivados
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Los proyectos que archives aparecerán aquí.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedProjects.map((project) => (
              <ArchivedProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedProjects;
