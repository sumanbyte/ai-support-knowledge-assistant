import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ProtectedRouteLoaderData } from '../../loaders/protectedRoute.loader';

export default function ProtectedRoute() {
  const { user } = useLoaderData<ProtectedRouteLoaderData>();
  const { setUser } = useAuth();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <Outlet />;
}
