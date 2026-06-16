import { Navigate, RouteObject } from "react-router";

import AuthGuard from "@/middleware/AuthGuard";
import { DynamicLayout } from "../layouts/DynamicLayout";
import { AppLayout } from "../layouts/AppLayout";

/**
 * Protected routes configuration
 * These routes require authentication to access
 * Uses AuthGuard middleware to verify user authentication
 */
const protectedRoutes: RouteObject = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // Separate page
    {
      path: "select-company",
      lazy: async () => ({
        Component: (await import("@/app/pages/Auth/Selectecompany")).default,
      }),
    },

    // Dashboard pages only
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards/home" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("@/app/pages/dashboards/home"))
                  .default,
              }),
            },
          ],
        },
          {
      path: "master",
      children: [
        {
          path: "category",
          lazy: async () => ({
            Component: (
              await import("@/app/pages/master/category")
            ).default,
          }),
        },

        {
          path: "brand",
          lazy: async () => ({
            Component: (
              await import("@/app/pages/master/brand")
            ).default,
          }),
        },

        {
          path: "model",
          lazy: async () => ({
            Component: (
              await import("@/app/pages/master/model")
            ).default,
          }),
        },

        {
          path: "year",
          lazy: async () => ({
            Component: (
              await import("@/app/pages/master/modelyear")
            ).default,
          }),
        },

        {
          path: "variant",
          lazy: async () => ({
            Component: (
              await import("@/app/pages/master/variant/KYCForm")
            ).default,
          }),
        },

          {
          path: "showroomvariant",
          lazy: async () => ({
            Component: (
              await import("@/app/pages/master/showroomvariant")
            ).default,
          }),
        },

      ],
    },  

    {
  path: "leadmaster",
  children: [
    {
      path: "leadbuilder",
      lazy: async () => ({
        Component: (
          await import("@/app/pages/leadmaster/leadbuilder")
        ).default,
      }),
    },
  ],
},
    
    




      ],
    },
  
    // The app layout supports only the main layout. Avoid using it for other layouts.
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("@/app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/settings/sections/General")
                ).default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
