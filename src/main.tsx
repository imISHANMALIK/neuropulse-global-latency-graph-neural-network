import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { GlobalMonitorPage } from '@/pages/GlobalMonitorPage'
import { ArchitecturePage } from '@/pages/ArchitecturePage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalMonitorPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/architecture",
    element: <ArchitecturePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/analytics",
    element: <GlobalMonitorPage />, // Placeholder for next phase
    errorElement: <RouteErrorBoundary />,
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)