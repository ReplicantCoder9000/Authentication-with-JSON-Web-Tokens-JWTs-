import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.tsx';
import Board from './pages/Board.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import EditTicket from './pages/EditTicket.tsx';
import CreateTicket from './pages/CreateTicket.tsx';
import Login from './pages/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const router = createHashRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Login />
        },
        {
          path: 'board',
          element: <ProtectedRoute><Board /></ProtectedRoute>
        },
        {
          path: 'edit',
          element: <ProtectedRoute><EditTicket /></ProtectedRoute>
        },
        {
          path: 'create',
          element: <ProtectedRoute><CreateTicket /></ProtectedRoute>
        }
      ]
    }
  ],
  {
    basename: '/'
  }
);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
