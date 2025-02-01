import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FiCheckSquare,
  FiClock,
  FiPlay,
  FiList,
  FiTrash2,
} from "react-icons/fi";
import { useParams } from "react-router-dom";

// Hook que trae las tareas
import { useGetTasks } from "../api/hooks/useGetTasks";
// Hook de mutación para actualizar tareas
import { useUpdateTask } from "../api/hooks/useUpdateTask";

// Importa tu componente ProjectTitle (maneja useGetProject adentro)
import ProjectTitle from "../components/board/ProjectTitle";

// Componentes locales
import Task from "../components/tasks/Task";
import CreateTaskModal from "../components/board/CreateTaskModal";
import UpdateTaskModal from "../components/tasks/UpdateTaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";

// Tarea "sortable" con handle y botones de Editar/Borrar
function SortableTask({ task, projectId }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Para modales de editar y borrar
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-white/80 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {/* Botones en esquina superior derecha */}
      <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
        {/* Botón Editar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditOpen(true);
          }}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Modificar Tarea"
        >
          <svg
            className="w-4 h-4 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M4 13V17H8L16.17 8.83L12.17 4.83L4 13ZM18.71 5.04C19.1 4.65 19.1 4.02 
                     18.71 3.63L16.37 1.29C15.98 0.9 15.35 0.9 14.96 
                     1.29L13 3.25L17 7.25L18.71 5.04Z"
            />
          </svg>
        </button>

        {/* Botón Borrar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteOpen(true);
          }}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Borrar Tarea"
        >
          <FiTrash2 className="w-4 h-4 text-gray-600" />
        </button>

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          title="Arrastrar la tarjeta"
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full cursor-grab"
        >
          <FiList className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <Task
        id={task.id}
        name={task.name}
        responsible={task.responsible}
        start_date={task.start_date}
        due_date={task.due_date}
        priority={task.priority}
      />

      {/* Modal Editar */}
      {isEditOpen && (
        <UpdateTaskModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          taskId={task.id}
          projectId={projectId}
        />
      )}
      {/* Modal Borrar */}
      {isDeleteOpen && (
        <DeleteTaskModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          taskId={task.id}
        />
      )}
    </div>
  );
}

// Estilos de columna según status
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

// Contenedor droppable para cada columna
function DroppableContainer({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[150px] transition-all duration-300 ${
        isOver
          ? "ring-2 ring-offset-2 ring-offset-white ring-indigo-300 scale-[1.01]"
          : ""
      }`}
    >
      {children}
    </div>
  );
}

// KanbanBoard principal
export default function KanbanBoard() {
  const { projectId } = useParams();

  // Hook que obtiene sólo las tareas (SIN projectName)
  const { data, isLoading, isError, error } = useGetTasks(projectId);

  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Para dragOverlay
  const [activeId, setActiveId] = useState(null);

  // Mutación para actualizar
  const { mutate } = useUpdateTask();
  const prevTasksRef = useRef([]);

  // Lista de estados (columnas)
  const statuses = ["Por Hacer", "En Progreso", "En Revisión", "Terminado"];

  // Cargar data en tasks locales
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setTasks(data);
    }
  }, [data]);

  // Detectar cambios de status => mutate
  useEffect(() => {
    const prevTasks = prevTasksRef.current;
    tasks.forEach((newT) => {
      const oldT = prevTasks.find((t) => t.id === newT.id);
      if (oldT && oldT.status !== newT.status) {
        mutate({
          taskId: newT.id,
          updates: { status: newT.status },
          projectId,
        });
      }
    });
    prevTasksRef.current = tasks;
  }, [tasks, mutate, projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Cargando tareas...</p>
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

  // Agrupar
  const columns = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  // DragOverlay
  const renderOverlayTask = () => {
    if (!activeId) return null;
    const draggingTask = tasks.find((t) => t.id === activeId);
    if (!draggingTask) return null;

    return (
      <div className="pointer-events-none bg-white/90 rounded-md shadow-2xl">
        <Task
          id={draggingTask.id}
          name={draggingTask.name}
          responsible={draggingTask.responsible}
          start_date={draggingTask.start_date}
          due_date={draggingTask.due_date}
          priority={draggingTask.priority}
        />
      </div>
    );
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    let toColumn = over.id;
    if (over.data?.current?.sortable) {
      toColumn = over.data.current.sortable.containerId;
    }

    if (!statuses.includes(toColumn)) return;

    // Actualiza local
    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id ? { ...task, status: toColumn } : task
      )
    );
    // Se encarga el useEffect de mutar
  };

  const noTasks = tasks.length === 0;

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-10">
          {/* AÑADIMOS el componente ProjectTitle que llama useGetProject, pero no afecta tus hooks en Board */}
          <ProjectTitle projectId={projectId} />
          <div className="fixed bottom-8 right-8">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-lg flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="text-xl">+</span>
              Crear Nueva Tarea
            </button>

            <CreateTaskModal
              isOpen={isModalOpen}
              projectId={projectId}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

          {noTasks ? (
            <div className="max-w-xl mx-auto mt-10">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.366-.773 1.42-.773 1.786 0l6.845 14.47A1 1 0 
                          0116 19H4a1 1 0 01-.888-1.342l6.845-14.47zM11 
                          14a1 1 0 10-2 0 1 1 0 
                          002 0zm-2-3a1 1 0 012 0v2a1 1 0 
                          01-2 0v-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 font-semibold">
                      ¡No hay tareas aún en este proyecto!
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Crea una nueva tarea para empezar a trabajar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-4">
              {Object.entries(columns).map(([columnName, tasksInColumn]) => {
                const style = getColumnStyle(columnName);

                return (
                  <div
                    key={columnName}
                    className={`relative flex flex-col rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-b ${style.gradient}`}
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

                    <DroppableContainer id={columnName}>
                      <SortableContext
                        id={columnName}
                        items={tasksInColumn.map((task) => task.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="p-4 space-y-4">
                          {tasksInColumn.map((task) => (
                            <SortableTask
                              key={task.id}
                              task={task}
                              projectId={projectId}
                            />
                          ))}
                          {tasksInColumn.length === 0 && (
                            <div
                              className={`h-24 border-2 border-dashed border-${style.accent}-300 rounded-xl flex items-center justify-center bg-white/30 text-gray-500 backdrop-blur-sm`}
                            >
                              <p className="text-sm font-medium">
                                Arrastra una tarea aquí
                              </p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </DroppableContainer>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DragOverlay>{renderOverlayTask()}</DragOverlay>
      </DndContext>
    </>
  );
}
