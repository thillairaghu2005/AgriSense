import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import RootErrorBoundary from '@/components/feedback/RootErrorBoundary';
import { PageSkeleton } from '@/components/ui/Skeleton';

// Lazy-load all page routes
const Dashboard = lazy(() => import('@/features/dashboard/DashboardPage'));
const CropCatalogue = lazy(() => import('@/features/crops/CropCataloguePage'));
const CropDetail = lazy(() => import('@/features/crops/CropDetailPage'));
const Recommendations = lazy(() => import('@/features/recommendations/RecommendationsPage'));
const Calendar = lazy(() => import('@/features/calendar/CalendarPage'));
const MarketPrices = lazy(() => import('@/features/market/MarketPricesPage'));
const Weather = lazy(() => import('@/features/weather/WeatherPage'));
const Assistant = lazy(() => import('@/features/assistant/AssistantPage'));
const Schemes = lazy(() => import('@/features/schemes/SchemesPage'));
const Applications = lazy(() => import('@/features/applications/ApplicationsPage'));
const SeedDistribution = lazy(() => import('@/features/seeds/SeedDistributionPage'));
const Plantations = lazy(() => import('@/features/plantations/PlantationsPage'));
const Grievances = lazy(() => import('@/features/grievances/GrievancesPage'));
const DbtLedger = lazy(() => import('@/features/dbt/DbtLedgerPage'));
const Analytics = lazy(() => import('@/features/analytics/AnalyticsPage'));
const GovernmentResources = lazy(() => import('@/features/resources/GovernmentResourcesPage'));
const PestsDiseases = lazy(() => import('@/features/pests-diseases/PestsDiseasesPage'));
const Soil = lazy(() => import('@/features/soil/SoilPage'));
const Finances = lazy(() => import('@/features/finances/FinancesPage'));
const Knowledge = lazy(() => import('@/features/knowledge/KnowledgePage'));
const ArticleDetail = lazy(() => import('@/features/knowledge/ArticleDetailPage'));
const Notifications = lazy(() => import('@/features/notifications/NotificationsPage'));
const Profile = lazy(() => import('@/features/profile/ProfilePage'));
const NotFound = lazy(() => import('@/features/NotFoundPage'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: 'schemes', element: <SuspenseWrapper><Schemes /></SuspenseWrapper> },
      { path: 'applications', element: <SuspenseWrapper><Applications /></SuspenseWrapper> },
      { path: 'seed-distribution', element: <SuspenseWrapper><SeedDistribution /></SuspenseWrapper> },
      { path: 'plantations', element: <SuspenseWrapper><Plantations /></SuspenseWrapper> },
      { path: 'grievances', element: <SuspenseWrapper><Grievances /></SuspenseWrapper> },
      { path: 'dbt-ledger', element: <SuspenseWrapper><DbtLedger /></SuspenseWrapper> },
      { path: 'analytics', element: <SuspenseWrapper><Analytics /></SuspenseWrapper> },
      { path: 'government-resources', element: <SuspenseWrapper><GovernmentResources /></SuspenseWrapper> },
      { path: 'crops', element: <SuspenseWrapper><CropCatalogue /></SuspenseWrapper> },
      { path: 'crops/:cropId', element: <SuspenseWrapper><CropDetail /></SuspenseWrapper> },
      { path: 'recommendations', element: <SuspenseWrapper><Recommendations /></SuspenseWrapper> },
      { path: 'calendar', element: <SuspenseWrapper><Calendar /></SuspenseWrapper> },
      { path: 'market-prices', element: <SuspenseWrapper><MarketPrices /></SuspenseWrapper> },
      { path: 'weather', element: <SuspenseWrapper><Weather /></SuspenseWrapper> },
      { path: 'assistant', element: <SuspenseWrapper><Assistant /></SuspenseWrapper> },
      { path: 'pests-diseases', element: <SuspenseWrapper><PestsDiseases /></SuspenseWrapper> },
      { path: 'soil', element: <SuspenseWrapper><Soil /></SuspenseWrapper> },
      { path: 'farm-finances', element: <SuspenseWrapper><Finances /></SuspenseWrapper> },
      { path: 'knowledge', element: <SuspenseWrapper><Knowledge /></SuspenseWrapper> },
      { path: 'knowledge/:articleId', element: <SuspenseWrapper><ArticleDetail /></SuspenseWrapper> },
      { path: 'notifications', element: <SuspenseWrapper><Notifications /></SuspenseWrapper> },
      { path: 'profile', element: <SuspenseWrapper><Profile /></SuspenseWrapper> },
      { path: '404', element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
