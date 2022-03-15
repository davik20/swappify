import React from 'react';
import { Redirect } from 'react-router';
import { Route, RouteProps } from 'react-router-dom';
import { useAppSelector } from '../hooks/storeHooks';
import { path } from '../routes/Routes';
import SidebarLayout from '../layout/SidebarLayout';

interface Props extends RouteProps {
  component: Required<RouteProps>['component'];
}

const AuthRoute = ({ ...routeProps }: Props) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <Redirect to={path.home} />
  ) : (
    <SidebarLayout noPadding={true}>
      <Route {...routeProps} />
    </SidebarLayout>
  );
};

export default AuthRoute;
