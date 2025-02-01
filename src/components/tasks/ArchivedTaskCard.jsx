import React, { useState } from "react";
import { FiCalendar, FiUser, FiFlag, FiEye } from "react-icons/fi";
import ArchivedTaskModal from "./ArchivedTaskModal";

const ArchivedTaskCard = ({ id, name, responsible, start_date, due_date, priority, projectId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "bg-red-500 text-white";
      case "media":
        return "bg-yellow-500 text-gray-900";
      case "baja":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("es-ES", options).format(new Date(dateString));
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <>
      <div className="relative p-5 bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Archived Badge */}
        <div className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
          Archivado
        </div>

        {/* Prioridad */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(priority)}`}>
            {priority}
          </span>
        </div>

        {/* Nombre */}
        <h3 className="text-lg font-bold text-gray-800 leading-tight tracking-tight mb-2" title={name}>
          {name}
        </h3>

        {/* Responsable */}
        <div className="flex items-center space-x-3 bg-gray-100 p-2 rounded-lg mb-3">
          <FiUser className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">{responsible}</span>
        </div>

        {/* Fechas */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg flex-1">
            <FiCalendar className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-gray-600">
              {formatDate(start_date)}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg flex-1 ml-2">
            <FiFlag className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-medium text-gray-600">
              {formatDate(due_date)}
            </span>
          </div>
        </div>

        {/* Ver Detalles Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          <FiEye className="w-4 h-4" />
          <span>Ver Detalles</span>
        </button>
      </div>

      {/* Modal */}
      <ArchivedTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskId={id}
        projectId={projectId}
      />
    </>
  );
};

export default ArchivedTaskCard;