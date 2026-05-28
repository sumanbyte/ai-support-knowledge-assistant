import { redirect } from 'react-router-dom';
import type { AuthUserDto } from '../api';
import { authService } from '../services/authService';

export type ProtectedRouteLoaderData = {
  user: AuthUserDto;
};

/** Blocks protected routes from rendering until /auth/me succeeds. */
export const protectedRouteLoader = async (): Promise<
  ProtectedRouteLoaderData | Response
> => {
  try {
    const user = await authService.getCurrentUser();
    return { user };
  } catch {
    return redirect('/login');
  }
};
