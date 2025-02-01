import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiArrowRight, FiTrash2 } from "react-icons/fi";
import DeleteProjectModal from "./DeleteProjectModal";

const ArchivedProjectCard = ({ id, name, description, office, date_created }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("es-ES", options).format(
        new Date(dateString)
      );
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      {/* Office Badge */}
      <div className="flex justify-between items-center mb-4">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          {office}
        </span>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Archivado
        </span>
      </div>

      {/* Project Name */}
      <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-200">
        {name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      {/* Date Created */}
      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg mb-4">
        <FiCalendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          Creado el {formatDate(date_created)}
        </span>
      </div>

      {/* Action Buttons Container */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to={`/archivedboard/${id}`}
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          <span>Ver Proyecto</span>
          <FiArrowRight className="w-5 h-5 ml-2" />
        </Link>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
        >
          <FiTrash2 className="w-5 h-5 mr-2" />
          <span>Eliminar</span>
        </button>
      </div>

      {/* Delete Modal */}
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        projectId={id}
      />
    </div>
  );
};

export default ArchivedProjectCard;