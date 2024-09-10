import { useMemo, useEffect, useCallback, createContext } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import API from 'src/utils/API';
import { STORAGE_KEY } from './constant';
import { setSession, isValidToken } from './utils';

import type { IAuthContext, IUser } from '../../types';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export const AuthContext = createContext<IAuthContext>({
  user: null,
  loading: true,
  authenticated: false,
  permissions: [],
});

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<IAuthContext>({
    user: null,
    loading: true,
    authenticated: false,
    permissions: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async checkUserSession() {},
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const { data } = await API.get<IUser>(`/profile`);
        const { data: permissions } = await API.get<string[]>(`/users/getPermissions`);

        setState({ user: { ...data }, loading: false, permissions, authenticated: true });
      } else {
        setState({ user: null, loading: false, authenticated: false });
      }
    } catch (error) {
      // console.error(error);
      setState({ user: null, loading: true, authenticated: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const getPermissions = useCallback(async () => {
  //   const { data } = await API.get<string[]>(`/users/getPermissions`);
  //   setState({ permissions: data });
  // }, [setState]);

  // useEffect(() => {
  //   if (!state.user) return;
  //   getPermissions();
  // }, [state.user, getPermissions]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.roles[0] ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      permissions: state.permissions || [],
    }),
    [checkUserSession, state, status]
  );
  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
