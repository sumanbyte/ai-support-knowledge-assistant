import { useNavigate } from 'react-router-dom';
import { PAGE_PATHS } from '../config/paths';
import type { PageType } from '../types/navigation';

export function useAppNavigate() {
  const navigate = useNavigate();
  return (page: PageType) => navigate(PAGE_PATHS[page]);
}
