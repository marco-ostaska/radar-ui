import App from "@/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RadarFiiPage from "@/pages/RadarFiiPage";
import ListaFiisPage from "@/pages/ListaFiisPage";
import ListaAcoesPage from "@/pages/ListaAcoesPage";
import AddAtivoPage from "@/pages/AddAtivoPage";
import RemoveAtivoPage from "@/pages/RemoveAtivoPage";
import RadarAcoes from "@/pages/RadarAcoesPage";
// import RadarAcoesPage from "@/pages/RadarAcoesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "radar/fii", element: <RadarFiiPage /> },
      { path: "lista/fiis", element: <ListaFiisPage /> },
      { path: "lista/acoes", element: <ListaAcoesPage /> },
      { path: "admin/add", element: <AddAtivoPage /> },
      { path: "admin/remove", element: <RemoveAtivoPage /> },
      { path: "radar/acoes", element: <RadarAcoes /> },
      // { path: "radar/acoes", element: <RadarAcoesPage /> },
    ],
  },
]);
