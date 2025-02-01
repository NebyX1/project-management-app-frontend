import { useGetProject } from "./useGetProject";
import { useGetTasks } from "./useGetTasks";

export function useBoardData(projectId) {
  // Llamamos SIEMPRE a los dos hooks en el mismo orden, sin condicionales:
  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useGetProject(projectId);

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
  } = useGetTasks(projectId);

  // Combinamos la información en un único objeto de salida
  const isLoading = isProjectLoading || isTasksLoading;
  const isError = isProjectError || isTasksError;
  // Podrías combinar los mensajes de error en uno si quieres
  const error = projectError || tasksError;
  // O dejarlos separados, pero para simplificar:
  const project = projectData;
  const tasks = tasksData;

  return {
    isLoading,
    isError,
    error,
    project,
    tasks,
  };
}
