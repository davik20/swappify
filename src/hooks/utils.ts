import React, { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import { path } from '../routes/Routes';

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

type Path = keyof typeof path;

export const goTo = (route: Path) => {
  const history = useHistory();
  const location = useLocation();

  return (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    history.push(path[route], { originalDestination: location.pathname + location.search });
  }
}
