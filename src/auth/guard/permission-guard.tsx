import React, { useEffect, useState } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { useRouter } from 'src/routes/hooks';
import { useAuth } from '../context/jwt/hooks';

interface Props {
  children: React.ReactNode;
  permission: string;
}

const PermissionGuard: React.FC<Props> = ({ children, permission }) => {
  const { authenticated, permissions, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      setIsChecking(false);
      return;
    }

    if (!authenticated) {
      setIsChecking(false);
      return;
    }

    if (permissions.includes(permission)) {
      setIsChecking(false);
    } else {
      router.replace('/403');
    }
  }, [authenticated, permissions, loading, permission, router]);

  return <>{isChecking ? <SplashScreen /> : children}</>;
};

export default PermissionGuard;
