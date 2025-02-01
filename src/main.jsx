import { createRoot } from 'react-dom/client'
import '../src/styles/Global.css'

// ? Importamos el router
import Router from './router/Router'

//? Importamos queryclient
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./api/queryClient.js";

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Router />
  </QueryClientProvider>
)
