import App from "@/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ListaFiisPage from "@/pages/ListaFiisPage";
import ListaAcoesPage from "@/pages/ListaAcoesPage";
import AddAtivoPage from "@/pages/AddAtivoPage";
import RemoveAtivoPage from "@/pages/RemoveAtivoPage";
import RadarAcoes from "@/pages/RadarAcoesPage";
import RadarAcoesDia from "@/pages/RadarAcoesDia";
import RadarFiisPage from "@/pages/RadarFiisPage";
import RadarFIIsDia from "@/pages/RadarFIIsDia";
import BuscaAcoesPage from "@/pages/BuscaAcoesPage";
import BuscaFIIsPage from "@/pages/BuscaFIIsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "radar/fii", element: <RadarFiisPage /> },
      { path: "lista/fiis", element: <ListaFiisPage /> },
      { path: "lista/acoes", element: <ListaAcoesPage /> },
      { path: "admin/add", element: <AddAtivoPage /> },
      { path: "admin/remove", element: <RemoveAtivoPage /> },
      { path: "radar/acoes", element: <RadarAcoes /> },
      { path: "radar/acoes/dia", element: <RadarAcoesDia /> },
      { path: "radar/fii/dia", element: <RadarFIIsDia /> },
      { path: "busca/acoes/", element: <BuscaAcoesPage /> },
      { path: "busca/fii/", element: <BuscaFIIsPage /> },

      // { path: "radar/acoes", element: <RadarAcoesPage /> },
    ],
  },
]);
