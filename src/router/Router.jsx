import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import Board from "../pages/Board";
import ArchivedBoard from "../pages/ArchivedBoard";
import Home from "../pages/Home";
import ArchivedProjects from "../pages/ArchivedProjects";
import KPIs from "../pages/KPIs";
import Gantt from "../pages/Gantt";
import Login from "../pages/Login";
import { ProtectedRoutes, LoginGuard } from "./Middleware";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Protected Routes */}
      <Route
        index
        element={
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/archived"
        element={
          <ProtectedRoutes>
            <ArchivedProjects />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/kpis/:projectId"
        element={
          <ProtectedRoutes>
            <KPIs />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/gantt/:projectId"
        element={
          <ProtectedRoutes>
            <Gantt />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/board/:projectId"
        element={
          <ProtectedRoutes>
            <Board />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/archivedboard/:projectId"
        element={
          <ProtectedRoutes>
            <ArchivedBoard />
          </ProtectedRoutes>
        }
      />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <LoginGuard>
            <Login />
          </LoginGuard>
        }
      />
      {/* Catch all route - redirect to home */}
      <Route
        path="*"
        element={
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        }
      />
    </Route>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
