import App from "@/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RadarFiiPage from "@/pages/RadarFiiPage";
// import RadarAcoesPage from "@/pages/RadarAcoesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "radar/fii", element: <RadarFiiPage /> },
      // { path: "radar/acoes", element: <RadarAcoesPage /> },
    ],
  },
]);
