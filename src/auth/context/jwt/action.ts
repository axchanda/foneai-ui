import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  username: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  confirmPassword: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }: SignInParams): Promise<void> => {
  try {
    const params = { username, password };

    const res = await axios.post(endpoints.auth.signIn, params);
    // console.clear()
    // console.log(res.data)
    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    setSession(token);
  } catch (error) {
    // console.error('Error during sign in:', error);
    throw error.errors;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
  username,
  confirmPassword,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
    username,
    role: 'PBX',
    profileLanguage: 'en',
    confirmPassword,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    // console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    // console.error('Error during sign out:', error);
    throw error;
  }
};
