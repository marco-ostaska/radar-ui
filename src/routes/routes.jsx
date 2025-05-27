import App from "@/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RadarFiiPage from "@/pages/RadarFiiPage";
import ListaFiisPage from "@/pages/ListaFiisPage";
import ListaAcoesPage from "@/pages/ListaAcoesPage";
// import RadarAcoesPage from "@/pages/RadarAcoesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "radar/fii", element: <RadarFiiPage /> },
      { path: "lista/fiis", element: <ListaFiisPage /> },
      { path: "lista/acoes", element: <ListaAcoesPage /> },
      // { path: "radar/acoes", element: <RadarAcoesPage /> },
    ],
  },
]);
