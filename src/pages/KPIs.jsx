import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import GaugeChart from "react-gauge-chart";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetTasks } from "../api/hooks/useGetTasks";
import { isBefore } from "date-fns";
import ProjectTitle from "../components/board/ProjectTitle"; // Importar el componente ProjectTitle
import { FiFolder } from "react-icons/fi"; // Icono para el mensaje de alerta

const KPIs = () => {
  const { projectId } = useParams(); // Obtener projectId de la URL
  const { data: tasks, isLoading, error } = useGetTasks(projectId); // Obtener tareas usando el hook

  const [statusCounts, setStatusCounts] = useState({
    "Por Hacer": 0,
    "En Progreso": 0,
    "En Revisión": 0,
    "Terminado": 0,
  });

  const [priorityCounts, setPriorityCounts] = useState({
    "Alta": 0,
    "Media": 0,
    "Baja": 0,
  });

  const [overdueTasks, setOverdueTasks] = useState(0);
  const [averageCompletionTime, setAverageCompletionTime] = useState(0);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const total = tasks.length;

      // Contar tareas por estado
      const status = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});
      setStatusCounts({
        "Por Hacer": status["Por Hacer"] || 0,
        "En Progreso": status["En Progreso"] || 0,
        "En Revisión": status["En Revisión"] || 0,
        "Terminado": status["Terminado"] || 0,
      });

      // Contar tareas por prioridad
      const priority = tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {});
      setPriorityCounts({
        "Alta": priority["Alta"] || 0,
        "Media": priority["Media"] || 0,
        "Baja": priority["Baja"] || 0,
      });

      // Calcular tareas vencidas
      const today = new Date();
      const overdue = tasks.filter(
        (task) =>
          isBefore(new Date(task.due_date), today) && task.status !== "Terminado"
      ).length;
      setOverdueTasks(overdue);

      // Calcular tiempo promedio para completar tareas
      const completedTasks = tasks.filter(task => task.status === "Terminado");
      if (completedTasks.length > 0) {
        const totalDays = completedTasks.reduce((acc, task) => {
          const start = new Date(task.start_date);
          const end = new Date(task.due_date);
          const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
          return acc + days;
        }, 0);
        const average = (totalDays / completedTasks.length).toFixed(2);
        setAverageCompletionTime(average);
      } else {
        setAverageCompletionTime(0);
      }
    }
  }, [tasks]);

  // Calcular porcentaje completado
  const percentCompleted = useMemo(() => {
    if (tasks && tasks.length > 0) {
      return (statusCounts["Terminado"] / tasks.length) * 100;
    }
    return 0;
  }, [statusCounts, tasks]);

  // Datos para el PieChart de estados
  const statusData = useMemo(() => {
    return [
      { name: "Por Hacer", value: statusCounts["Por Hacer"] },
      { name: "En Progreso", value: statusCounts["En Progreso"] },
      { name: "En Revisión", value: statusCounts["En Revisión"] },
      { name: "Terminado", value: statusCounts["Terminado"] },
    ];
  }, [statusCounts]);

  const statusColors = {
    "Por Hacer": "#d9d9d9", // Gris
    "En Progreso": "#1890ff", // Azul
    "En Revisión": "#faad14", // Amarillo
    "Terminado": "#52c41a", // Verde
  };

  // Datos para el BarChart de prioridades
  const priorityData = useMemo(() => {
    return [
      { name: "Alta", count: priorityCounts["Alta"] },
      { name: "Media", count: priorityCounts["Media"] },
      { name: "Baja", count: priorityCounts["Baja"] },
    ];
  }, [priorityCounts]);

  const priorityColors = {
    "Alta": "#ff4d4f", // Rojo
    "Media": "#faad14", // Amarillo
    "Baja": "#52c41a", // Verde
  };

  // Verificar si hay tareas disponibles
  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg">
        {/* Componente ProjectTitle */}
        <ProjectTitle projectId={projectId} />

        <div className="bg-white border-l-4 border-blue-400 p-6 rounded-lg shadow-md flex items-center mt-6">
          <FiFolder className="h-6 w-6 text-blue-400 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-lg text-gray-700">No hay tareas creadas para este proyecto aún.</p>
            <p className="text-sm text-gray-600 mt-1">
              Empieza a crear tareas para gestionar el progreso del proyecto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      {/* Componente ProjectTitle */}
      <ProjectTitle projectId={projectId} />

      <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-4">KPIs del Proyecto</h2>
      <p className="text-gray-500 mb-6">Indicadores clave de rendimiento</p>

      {/* GaugeChart para porcentaje completado */}
      <div className="w-full max-w-lg mx-auto mb-8">
        <GaugeChart
          id="gauge-chart"
          nrOfLevels={20}
          percent={percentCompleted / 100}
          arcWidth={0.3}
          colors={["#ff4d4f", "#faad14", "#52c41a"]}
          textColor="#374151"
          needleColor="#374151"
          needleBaseColor="#374151"
          animate={true}
          formatTextValue={() => `${percentCompleted.toFixed(2)}%`}
        />
        <div className="text-center mt-2 text-gray-700">
          Progreso General
        </div>
      </div>

      {/* PieChart para distribución de estados */}
      <div className="w-full max-w-lg mx-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Estado de las Tareas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BarChart para distribución de prioridades */}
      <div className="w-full max-w-lg mx-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Prioridad de las Tareas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8">
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={priorityColors[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* KPIs adicionales */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total de Tareas */}
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">Total de Tareas</h3>
          <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
        </div>

        {/* Tareas Completadas */}
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">Tareas Completadas</h3>
          <p className="text-3xl font-bold text-gray-900">{statusCounts["Terminado"]}</p>
        </div>

        {/* Tareas Pendientes */}
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">Tareas Pendientes</h3>
          <p className="text-3xl font-bold text-gray-900">{statusCounts["Por Hacer"]}</p>
        </div>

        {/* Tareas en Progreso */}
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">Tareas en Progreso</h3>
          <p className="text-3xl font-bold text-gray-900">{statusCounts["En Progreso"]}</p>
        </div>

        {/* Tareas Vencidas */}
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">Tareas Vencidas</h3>
          <p className="text-3xl font-bold text-gray-900">{overdueTasks}</p>
        </div>

        {/* Tiempo Promedio de Compleción */}
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">Tiempo Promedio de Compleción</h3>
          <p className="text-3xl font-bold text-gray-900">{averageCompletionTime} días</p>
        </div>
      </div>
    </div>
  );
};

export default KPIs;
