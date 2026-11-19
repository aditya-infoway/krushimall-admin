// Import Dependencies
import { createBrowserRouter, RouteObject,createHashRouter } from "react-router";

// Local Imports
import Root from "@/app/layouts/Root";
import RootErrorBoundary from "@/app/pages/errors/RootErrorBoundary";
import { SplashScreen } from "@/components/template/SplashScreen";
import { protectedRoutes } from "./protected";
import { ghostRoutes } from "./ghost";
import { publicRoutes } from "./public";

/**
 * Main application router configuration
 * Combines protected, ghost, and public routes under a common root
 */
const isCapacitor = import.meta.env.MODE === "capacitor";
const createRouter = isCapacitor ? createHashRouter : createBrowserRouter;
const router = createRouter(
  [
    {
      id: "root",
      Component: Root,
      hydrateFallbackElement: <SplashScreen />,
      ErrorBoundary: RootErrorBoundary,
      children: [
        protectedRoutes,
        ghostRoutes,
        publicRoutes,
      ] as RouteObject[],
    },
  ],
  {
basename: isCapacitor ? "/" : "/krushimall-admin",
  }
);

export default router;