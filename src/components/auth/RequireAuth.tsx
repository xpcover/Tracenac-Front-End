import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS } from '@/constants/paths';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(()=> {
    // dispatch(setUserInfo())
  },[])

  if (!isAuthenticated) {
    return <Navigate to={PATHS.PUBLIC.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
 
export default RequireAuth;
