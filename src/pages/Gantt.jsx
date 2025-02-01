import React from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell // Importar Cell con mayúscula
} from 'recharts';
import { useGetTasks } from '../api/hooks/useGetTasks';
import ProjectTitle from "../components/board/ProjectTitle"; // Importar el componente ProjectTitle
import { FiFolder } from "react-icons/fi"; // Icono para el mensaje de alerta

// Función para obtener el color de la tarea
const getTaskColor = (task) => {
  const today = new Date();
  const dueDate = new Date(task.due_date);
  
  if (dueDate < today && task.status !== "Terminado") {
    return "#ff4d4f"; // Rojo para tareas vencidas
  }
  
  switch (task.status) {
    case "Terminado":
      return "#800080"; // Violeta oscuro
    case "En Revisión":
      return "#faad14"; // Amarillo
    case "En Progreso":
      return "#1890ff"; // Azul
    default:
      return "#d9d9d9"; // Gris para "Por Hacer"
  }
};

// Función para obtener el progreso basado en el estado
const getStatusProgress = (status) => {
  switch (status) {
    case "Terminado":
      return 100;
    case "En Revisión":
      return 75;
    case "En Progreso":
      return 50;
    case "Por Hacer":
      return 0;
    default:
      return 0;
  }
};

const Gantt = () => {
  const { projectId } = useParams();
  const { data: tasks, isLoading, error } = useGetTasks(projectId);

  if (isLoading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

  // Verificar si hay tareas disponibles
  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg">
        {/* Componente ProjectTitle */}
        <ProjectTitle projectId={projectId} />

        <div className="bg-white border-l-4 border-blue-400 p-6 rounded-lg shadow-md flex items-center">
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

  // Encontrar la fecha mínima de inicio
  const minStartDate = tasks.reduce((min, task) => {
    const start = new Date(task.start_date);
    return min < start ? min : start;
  }, new Date(tasks[0].start_date));

  // Función para calcular días entre dos fechas
  const daysBetween = (start, end) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((end - start) / oneDay);
  };

  // Mapeo de datos para el gráfico
  const chartData = tasks.map(task => ({
    name: task.name,
    responsible: task.responsible,
    start: daysBetween(minStartDate, new Date(task.start_date)),
    duration: daysBetween(new Date(task.start_date), new Date(task.due_date)),
    progress: getStatusProgress(task.status),
    color: getTaskColor(task),
    status: task.status
  }));

  // Determinar el rango del eje X
  const maxDay = chartData.reduce((max, task) => {
    const endDay = task.start + task.duration;
    return endDay > max ? endDay : max;
  }, 0);

  const statusColors = [
    { status: "Terminado", color: "#800080" }, // Violeta oscuro
    { status: "En Revisión", color: "#faad14" },
    { status: "En Progreso", color: "#1890ff" },
    { status: "Por Hacer", color: "#d9d9d9" },
    { status: "Vencido", color: "#ff4d4f" }
  ];

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      {/* Componente ProjectTitle */}
      <ProjectTitle projectId={projectId} />

      <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-4">
        Diagrama de Gantt
      </h2>
      <p className="text-gray-500 mb-6">Línea de tiempo del proyecto</p>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 mb-6">
        {statusColors.map(({ status, color }) => (
          <div key={status} className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-600">{status}</span>
          </div>
        ))}
      </div>

      <div className="w-full" style={{ height: `${chartData.length * 50 + 100}px` }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, maxDay + 5]} // Agrega un margen al máximo
              tickFormatter={(tick) => {
                const date = new Date(minStartDate);
                date.setDate(date.getDate() + tick);
                return date.toLocaleDateString();
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={props => (
                <g transform={`translate(${props.x},${props.y})`}>
                  <text x={0} y={0} dy={4} textAnchor="end" fill="#666">
                    {props.payload.value}
                  </text>
                  <text x={0} y={20} dy={4} textAnchor="end" fill="#999" fontSize="12">
                    {chartData.find(d => d.name === props.payload.value)?.responsible}
                  </text>
                </g>
              )}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const startDate = new Date(minStartDate);
                  startDate.setDate(startDate.getDate() + data.start);
                  const endDate = new Date(startDate);
                  endDate.setDate(endDate.getDate() + data.duration);
                  return (
                    <div className="bg-white p-3 shadow-lg rounded-lg border">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm text-gray-600">Responsable: {data.responsible}</p>
                      <p className="text-sm text-gray-600">
                        Inicio: {startDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Fin: {endDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Estado: {data.status}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Barra para el inicio (invisible) */}
            <Bar dataKey="start" stackId="a" fill="transparent" />
            {/* Barra para la duración */}
            <Bar
              dataKey="duration"
              stackId="a"
              fill="#8884d8" // Color por defecto, se sobrescribe en el siguiente paso
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} /> 
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Gantt;
