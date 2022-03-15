import { useEffect, useState } from 'react';

// Taken from an implementation which uses a provider.
// This bypasses the need to include the provider, but beware of using this in multiple places in your component tree
// Best practice would be to include in one wrapper layout component
const useWindowHeight = () => {
  const [height, setHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const handler = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return height;
};

export default useWindowHeight;
