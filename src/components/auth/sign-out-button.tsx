'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';

export function SignOutButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-out`;
      await axios.get(apiUrl, {
        withCredentials: true
      });
      dispatch(logout());
      router.push('/auth/sign-in');
      toast.success('Signed out Successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div onClick={handleLogout} className='w-full cursor-pointer'>
        Log out
      </div>
    </>
  );
}
