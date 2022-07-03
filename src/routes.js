import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/Page404';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
import Device from './pages/Device';
import DeviceInfo from './pages/DeviceInfo';
import AddDevice from './pages/AddDevice';
import Configuration from './pages/Configuration';
import AddEditConfiguration from './pages/AddEditConfiguration';

// ----------------------------------------------------------------------

export default function Router({ isLoggedIn }) {
  return useRoutes([
    {
      path: '/',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'dashboard', element: <DashboardApp /> },
        { path: 'update-profile', element: <UpdateProfile /> },
        { path: 'change-password', element: <ChangePassword /> },
        { path: 'devices', element: <Device /> },
        { path: 'add-device', element: <AddDevice /> },
        { path: 'info/:id', element: <DeviceInfo /> },
        { path: 'configuration', element: <Configuration /> },
        { path: 'add-configuration', element: <AddEditConfiguration /> },
        { path: 'edit-configuration/:id', element: <AddEditConfiguration /> }
      ]
    },
    {
      path: '/',
      element: !isLoggedIn ? <LogoOnlyLayout /> : <Navigate to="/dashboard" />,
      children: [
        {
          path: '/',
          element: !isLoggedIn ? <Navigate to="/login" /> : <Navigate to="/dashboard" />
        },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
