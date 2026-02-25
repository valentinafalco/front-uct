import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/index.css";

import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/Home";
import UctForm from "@/pages/UctForm";
import NotFound from "@/pages/NotFound";

// auth
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// nuevas páginas
import PersonalLanding from "@/pages/PersonalHome"; // título + botón Agregar + Volver
import Personal from "@/pages/PersonalForm";               // formulario de personal
import PersonalDetalle from "./pages/PersonalDetalle";
import DocumentacionDetalle from "./pages/DocumentacionDetalle";
import DocumentacionForm from "./pages/DocumentacionForm";
import DocumentacionLanding from "./pages/DocumentacionHome";
import PersonalForm from "@/pages/PersonalForm";


// Definición de rutas
const router = createBrowserRouter([
  // rutas públicas (sin login)
  { path: "/login", element: <Login /> },
  { path: "/registro", element: <Register /> },

  // rutas protegidas (requieren estar logueado)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },

      // UCT
      { path: "uct/nueva", element: <UctForm /> },

      // Personal
      { path: "personal", element: <PersonalLanding /> },   // landing  
      { path: "personal/nuevo", element: <PersonalForm /> },    // formulario
      { path: "personal/:rol/:id", element: <PersonalDetalle /> }, // detalle de personal
      { path: "personal/:rol/:id/editar", element: <PersonalForm /> }, // editar personal
      
      // Documentación
      { path: "documentacion", element: <DocumentacionLanding /> },
      { path: "documentacion/nuevo", element: <DocumentacionForm /> },
      { path: "documentacion/:id", element: <DocumentacionDetalle /> },
      { path: "documentacion/:id/editar", element: <DocumentacionForm /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

// Cliente de React Query
const queryClient = new QueryClient();

// Renderizado de la aplicación
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
