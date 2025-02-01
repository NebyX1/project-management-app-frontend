import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiArrowRight, FiArchive, FiPieChart, FiActivity } from "react-icons/fi";
import ArchiveProjectModal from "./ArchiveProjectModal";
const ProjectCard = ({ id, name, description, office, date_created }) => {
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

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
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {office}
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
        <FiCalendar className="w-4 h-4 text-blue-500" />
        <span className="text-sm text-gray-600">
          Creado el {formatDate(date_created)}
        </span>
      </div>

      {/* Action Buttons Container */}
      <div className="grid grid-cols-4 gap-2">
        <Link
          to={`/board/${id}`}
          className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 shadow-sm hover:shadow transition-all duration-200"
          title="Ver Proyecto"
        >
          <FiArrowRight className="w-5 h-5 text-blue-600" />
        </Link>

        <Link
          to={`/kpis/${id}`}
          className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-b from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 shadow-sm hover:shadow transition-all duration-200"
          title="Ver KPIs"
        >
          <FiPieChart className="w-5 h-5 text-purple-600" />
        </Link>

        <Link
          to={`/gantt/${id}`}
          className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-b from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 shadow-sm hover:shadow transition-all duration-200"
          title="Ver Gantt"
        >
          <FiActivity className="w-5 h-5 text-green-600" />
        </Link>

        <button
          onClick={() => setIsArchiveModalOpen(true)}
          className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-b from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border border-amber-200 shadow-sm hover:shadow transition-all duration-200"
          title="Archivar Proyecto"
        >
          <FiArchive className="w-5 h-5 text-amber-600" />
        </button>
      </div>

      {/* Archive Modal */}
      <ArchiveProjectModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        projectId={id}
      />
    </div>
  );
};

export default ProjectCard;
