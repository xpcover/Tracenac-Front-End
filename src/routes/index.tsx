import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import { store } from '@/redux/store';
import { privateRoutesWithLayout } from './privateRoutes';
import NotFoundPage from '@/pages/404/NotFoundPage';

const LoginForm = lazy(() => import('@/components/auth/LoginForm'));
const TenantLoginForm = lazy(() => import('@/components/auth/TenantLogin'));

export function AllRoutes() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Routes>
            {/* Public Routes */}
            <Route path={PATHS.PUBLIC.LOGIN} element={<LoginForm />} />
            <Route path={PATHS.PUBLIC.TENANT_LOGIN} element={<TenantLoginForm />} />

            {/* Private Routes */}
            <Route
              path={privateRoutesWithLayout.path}
              element={privateRoutesWithLayout.element}
            >
              {privateRoutesWithLayout.children?.map((route, index) => (
                <Route
                  key={route.path || index}
                  index={route.index}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>

            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </Provider>
  );
}