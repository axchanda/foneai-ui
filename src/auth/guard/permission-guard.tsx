import React, { useEffect, useState } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { useRouter } from 'src/routes/hooks';
import { useAuth } from '../context/jwt/hooks';

interface Props {
  children: React.ReactNode;
  permission: string;
}

const PermissionGuard: React.FC<Props> = ({ children, permission }) => {
  const { authenticated, user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      setIsChecking(false);
      return;
    }

    if (!user) {
      setIsChecking(false);
      return;
    }

    if ((user.permissions as string[]).includes(permission)) {
      setIsChecking(false);
    } else {
      router.replace('/403');
    }
  }, [authenticated, user, loading, permission, router]);

  return <>{isChecking ? <SplashScreen /> : children}</>;
};

export default PermissionGuard;
