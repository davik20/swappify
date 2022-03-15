import React, { FunctionComponent, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Route, RouteProps } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
import { setIsAuthenticated, setIsInitialized } from '../store/authSlice';
import { path } from '../routes/Routes';
import LoadingScreen from '../components/LoadingScreen';
import SidebarLayout from '../layout/SidebarLayout';

interface OwnProps {
  component: Required<RouteProps>['component'];
}

type Props = OwnProps & RouteProps;

const AppRoute: FunctionComponent<Props> = ({ component: Component, ...routeProps }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isInitialized, isAuthenticated } = useAppSelector((state) => state.auth);

  function goToLogin() {
    history.push(path.login, { originalDestination: location.pathname + location.search });
  }

  useEffect(() => {
    if (isAuthenticated || isInitialized) {
      return;
    } else if (!isAuthenticated) {
      goToLogin()
    }

    // App initialization calls
    Promise.all([])
      .then(() => {
        // Create an initilization function here.
        dispatch(setIsInitialized(true));
      })
      .catch(() => {
        dispatch(setIsAuthenticated(false));
        goToLogin()
      });
  }, []);

  return (
    <SidebarLayout>
      <Route
        {...routeProps}
        render={({ ...props }) => {
          if (!isInitialized) {
            return <LoadingScreen />;
          } else {
            return <Component {...props} />;
          }
        }}
      />
    </SidebarLayout>
  );
};

export default AppRoute;
