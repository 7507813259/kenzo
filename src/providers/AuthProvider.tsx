'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { authCheckFinished, loginSuccess } from '@/store/slices/authSlice';

export default function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/global/me`;
        const response = await axios.get(apiUrl, { withCredentials: true });
        console.log(response);

        if (response.data) {
          dispatch(loginSuccess(response.data));
        }
      } catch (error) {
        console.log('No active session found.');
      } finally {
        dispatch(authCheckFinished());
      }
    };

    checkUserSession();
  }, [dispatch]);

  return <>{children}</>;
}
