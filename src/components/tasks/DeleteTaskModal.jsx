import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDeleteTask } from "../../api/hooks/useDeleteTask";

const DeleteTaskModal = ({ isOpen, onClose, taskId }) => {
  const deleteTask = useDeleteTask(); // Hook para eliminar tarea
  const [isConfirmed, setIsConfirmed] = useState(false); // Estado del checkbox

  useEffect(() => {
    setIsConfirmed(false); // Reinicia el checkbox al abrir el modal
  }, [isOpen]);

  const handleDelete = () => {
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        onClose(); // Cierra el modal tras eliminar la tarea
      },
      onError: (error) => {
        console.error("Error al eliminar la tarea:", error);
      },
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Advertencia */}
        <h2 className="text-xl font-bold text-yellow-600 bg-yellow-200 p-3 rounded-md text-center">
          ⚠️ Advertencia
        </h2>

        {/* Mensaje de alerta */}
        <p className="text-gray-700 mt-4 text-center">
          Las tareas que se borran <strong>no pueden ser recuperadas</strong>. <br />
          ¿Está seguro de que desea continuar?
        </p>

        {/* Checkbox de confirmación */}
        <div className="flex items-center justify-center mt-4">
          <input
            type="checkbox"
            id="confirmDelete"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            className="mr-2 w-5 h-5 text-red-500 focus:ring-red-400 cursor-pointer"
          />
          <label htmlFor="confirmDelete" className="text-sm text-gray-800 cursor-pointer">
            Debo eliminar esta tarea
          </label>
        </div>

        {/* Botones de acción */}
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
            Eliminar Tarea
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteTaskModal;
