import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDeleteProject } from "../../api/hooks/useDeleteProject";

const DeleteProjectModal = ({ isOpen, onClose, projectId }) => {
  const deleteProject = useDeleteProject();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setIsConfirmed(false);
  }, [isOpen]);

  const handleDelete = () => {
    deleteProject.mutate(projectId, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Error al eliminar el proyecto:", error);
      },
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-red-600 bg-red-100 p-3 rounded-md text-center">
          ⚠️ Advertencia
        </h2>

        <p className="text-gray-700 mt-4 text-center">
          Los proyectos eliminados <strong>no pueden ser recuperados</strong>. <br />
          ¿Está seguro de que desea eliminar este proyecto?
        </p>

        <div className="flex items-center justify-center mt-4">
          <input
            type="checkbox"
            id="confirmDelete"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            className="mr-2 w-5 h-5 text-red-500 focus:ring-red-400 cursor-pointer"
          />
          <label htmlFor="confirmDelete" className="text-sm text-gray-800 cursor-pointer">
            Deseo eliminar este proyecto permanentemente
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
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleDelete}
            disabled={!isConfirmed}
          >
            Eliminar Proyecto
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteProjectModal;