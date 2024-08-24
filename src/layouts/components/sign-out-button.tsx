import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import Button from '@mui/material/Button';

import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';
import { useRouter } from 'src/routes/hooks';
import { useAuth } from 'src/auth/context/jwt/hooks';
import { useCallback } from 'react';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

const signOut = jwtSignOut;

type Props = ButtonProps & {
  sx?: SxProps<Theme>;
  onClose?: () => void;
};

export function SignOutButton({ onClose, ...other }: Props) {
  const router = useRouter();

  const { checkUserSession } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [checkUserSession, onClose, router]);

  return (
    <Button fullWidth variant="soft" size="large" color="error" onClick={handleLogout} {...other}>
      Logout
    </Button>
  );
}
