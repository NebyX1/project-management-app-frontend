import React from "react";
import { createPortal } from "react-dom";
import { useGetTasks } from "../../api/hooks/useGetTasks";

const ArchivedTaskModal = ({ isOpen, onClose, taskId, projectId }) => {
  const { data: tasks, isLoading } = useGetTasks(projectId);
  const task = tasks?.find((t) => t.id === taskId);

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("es-ES", options).format(new Date(dateString));
    } catch {
      return "Fecha inválida";
    }
  };

  if (!isOpen || isLoading || !task) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Detalles de la Tarea</h2>
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Archivado
          </span>
        </div>

        {/* Nombre */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Nombre</h3>
          <p className="p-2 bg-gray-50 rounded-md text-gray-800">{task.name}</p>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Descripción</h3>
          <p className="p-2 bg-gray-50 rounded-md text-gray-800 min-h-[6rem] whitespace-pre-wrap">
            {task.description}
          </p>
        </div>

        {/* Responsable */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Responsable</h3>
          <p className="p-2 bg-gray-50 rounded-md text-gray-800">{task.responsible}</p>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</h3>
            <p className="p-2 bg-gray-50 rounded-md text-gray-800">
              {formatDate(task.start_date)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</h3>
            <p className="p-2 bg-gray-50 rounded-md text-gray-800">
              {task.due_date ? formatDate(task.due_date) : "No definida"}
            </p>
          </div>
        </div>

        {/* Prioridad y Estado */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Prioridad</h3>
            <p className="p-2 bg-gray-50 rounded-md text-gray-800">{task.priority}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Estado</h3>
            <p className="p-2 bg-gray-50 rounded-md text-gray-800">{task.status}</p>
          </div>
        </div>

        {/* Botón Cerrar */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ArchivedTaskModal;