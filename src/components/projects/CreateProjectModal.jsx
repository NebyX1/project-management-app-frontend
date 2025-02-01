import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useCreateProject } from "../../api/hooks/useCreateProject";

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [office, setOffice] = useState("");
  const createProject = useCreateProject();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      name,
      description,
      office,
    };

    createProject.mutate(newProject, {
      onSuccess: () => {
        onClose(); // Cierra el modal al terminar
      },
      onError: (error) => {
        console.error("Error al crear el proyecto:", error);
      },
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Crear Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              required
            ></textarea>
          </div>

          {/* Oficina */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oficina
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              required
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              disabled={createProject.isPending}
            >
              {createProject.isPending ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateProjectModal;
