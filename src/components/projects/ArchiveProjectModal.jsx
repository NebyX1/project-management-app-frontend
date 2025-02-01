import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useUpdateProject } from "../../api/hooks/useUpdateProject";

const ArchiveProjectModal = ({ isOpen, onClose, projectId }) => {
  const updateProject = useUpdateProject();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setIsConfirmed(false);
  }, [isOpen]);

  const handleArchive = () => {
    updateProject.mutate(projectId, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Error al archivar el proyecto:", error);
      },
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-yellow-600 bg-yellow-200 p-3 rounded-md text-center">
          ⚠️ Advertencia
        </h2>

        <p className="text-gray-700 mt-4 text-center">
          Los proyectos archivados <strong>no pueden ser reactivados</strong>. <br />
          ¿Está seguro de que desea archivar este proyecto?
        </p>

        <div className="flex items-center justify-center mt-4">
          <input
            type="checkbox"
            id="confirmArchive"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            className="mr-2 w-5 h-5 text-blue-500 focus:ring-blue-400 cursor-pointer"
          />
          <label htmlFor="confirmArchive" className="text-sm text-gray-800 cursor-pointer">
            Deseo archivar este proyecto
          </label>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md transition ${
              isConfirmed
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleArchive}
            disabled={!isConfirmed}
          >
            Archivar Proyecto
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ArchiveProjectModal;