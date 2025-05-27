import "@/index.css";
import { RouterProvider } from "react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { router } from "@/routes/routes.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
