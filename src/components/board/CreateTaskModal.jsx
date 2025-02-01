import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateTask } from "../../api/hooks/useCreateTask";

const CreateTaskModal = ({ isOpen, onClose, projectId }) => {
  // Estado inicial del formulario
  const initialFormState = {
    name: "",
    description: "",
    responsible: "",
    start_date: new Date(),
    due_date: null,
    priority: "Media",
    status: "Por Hacer"
  };

  const [formData, setFormData] = useState(initialFormState);

  const createTask = useCreateTask();

  // Función para limpiar el formulario
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      project: projectId,
      ...formData,
      start_date: formData.start_date.toISOString().split("T")[0],
      due_date: formData.due_date ? formData.due_date.toISOString().split("T")[0] : null,
    };

    createTask.mutate(newTask, {
      onSuccess: () => {
        resetForm();
        onClose();
      },
      onError: (error) => console.error("Error al crear la tarea:", error)
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Crear Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-24"
              required
            />
          </div>

          {/* Responsable */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
            <input
              type="text"
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Fecha de Vencimiento */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento</label>
            <DatePicker
              selected={formData.due_date}
              onChange={(date) => setFormData({ ...formData, due_date: date })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha"
              required
            />
          </div>

          {/* Prioridad */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={createTask.isLoading}
            >
              {createTask.isLoading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateTaskModal;
