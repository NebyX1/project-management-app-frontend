import React, { useState } from "react";
import { useProjects } from "../api/hooks/useProjects";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import ProjectCard from "../components/projects/ProjectCard";
import { FiFolder, FiPlus, FiLoader } from "react-icons/fi";

const Home = () => {
  const { data: projects, isLoading, isError } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <FiLoader className="w-6 h-6 animate-spin" />
          <span className="text-lg">Cargando proyectos...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">Error al cargar los proyectos.</div>
      </div>
    );
  }

  const activeProjects = projects
    .filter((project) => project.active)
    .sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiFolder className="text-blue-600" />
            Proyectos Activos
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-md"
          >
            <FiPlus className="w-5 h-5" />
            Nuevo Proyecto
          </button>
        </div>

        {activeProjects.length === 0 ? (
          <div className="bg-white border-l-4 border-blue-400 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiFolder className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-lg text-gray-700">
                  No hay proyectos activos
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Crea un nuevo proyecto para comenzar.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}

        <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
};

export default Home;