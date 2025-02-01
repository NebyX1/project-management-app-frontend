import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiCheckSquare, FiClock, FiPlay, FiList } from "react-icons/fi";
import { useGetTasks } from "../api/hooks/useGetTasks";
import ArchivedTaskCard from "../components/tasks/ArchivedTaskCard";

// Importa tu componente de título, 
// que internamente llama a useGetProject
import ProjectTitle from "../components/board/ProjectTitle"; 

function getColumnStyle(columnName) {
  switch (columnName) {
    case "Por Hacer":
      return {
        icon: <FiList className="w-5 h-5" />,
        gradient: "from-blue-100 via-blue-50 to-indigo-100",
        accent: "blue",
      };
    case "En Progreso":
      return {
        icon: <FiPlay className="w-5 h-5" />,
        gradient: "from-purple-100 via-pink-50 to-pink-100",
        accent: "purple",
      };
    case "En Revisión":
      return {
        icon: <FiClock className="w-5 h-5" />,
        gradient: "from-amber-100 via-amber-50 to-orange-100",
        accent: "amber",
      };
    case "Terminado":
      return {
        icon: <FiCheckSquare className="w-5 h-5" />,
        gradient: "from-green-100 via-emerald-50 to-emerald-100",
        accent: "emerald",
      };
    default:
      return {
        icon: null,
        gradient: "from-gray-50 to-gray-100",
        accent: "gray",
      };
  }
}

export default function ArchivedBoard() {
  const { projectId } = useParams();

  // Solo Hook de tareas (no metemos el project name aquí)
  const { data: tasks, isLoading, isError, error } = useGetTasks(projectId);

  const statuses = ["Por Hacer", "En Progreso", "En Revisión", "Terminado"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Cargando proyecto archivado...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-md">
          <p>Error: {error?.message}</p>
        </div>
      </div>
    );
  }

  // Agrupar las tareas por status
  const columns = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-10">
      {/* Aquí usamos ProjectTitle para mostrar el nombre del proyecto archivado */}
      <ProjectTitle projectId={projectId} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-4">
        {statuses.map((columnName) => {
          const style = getColumnStyle(columnName);
          const tasksInColumn = columns[columnName] || [];

          return (
            <div
              key={columnName}
              className={`relative flex flex-col rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-b ${style.gradient}`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-${style.accent}-400/80`}
              />
              <div className="p-4 bg-white/30 backdrop-blur-sm border-b border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`p-2 rounded-lg bg-white/80 text-${style.accent}-600 shadow-sm`}
                    >
                      {style.icon}
                    </span>
                    <h2 className="text-lg font-bold text-gray-700 tracking-wider">
                      {columnName}
                    </h2>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-${style.accent}-100 text-${style.accent}-600 shadow-sm`}
                  >
                    {tasksInColumn.length}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {tasksInColumn.map((task) => (
                  <div key={task.id} className="bg-white/80 rounded-md shadow-md">
                    {/* La card de la tarea archivada */}
                    <ArchivedTaskCard {...task} projectId={projectId} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
