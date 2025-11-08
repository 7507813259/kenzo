'use client';
import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import axios from 'axios';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GalleryVerticalEnd, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/custom/loading-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { loginSuccess } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '../ui/password-input';
import { useDispatch } from 'react-redux';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const slides = [
    {
      image: '/loginScreen/banner.png',
      title: 'Welcome back to Kenzo – Your Growth Starts Here'
    },
    {
      image: '/loginScreen/banner.png',
      title: 'Transform Your Team’s Performance Today'
    },
    {
      image: '/loginScreen/banner.png',
      title: 'Manage Campaigns Like Never Before'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-in`;
      const res = await axios.post(
        apiUrl,
        { email, password },
        { withCredentials: true }
      );
      if (res.data?.code?.toLowerCase() === 'success') {
        toast.success('Signed In Successfully!');
        dispatch(loginSuccess(res.data));
        router.push('/dashboard');
      } else if (res.data?.code?.toLowerCase() === 'auth_failed') {
        setError(
          res.data?.message || 'Invalid email or password. Please try again.'
        );
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const dummyRedirect = (e: any) => {
    e.preventDefault();
    router.push('/dashboard/overview');
  };

  return (
    <div className='flex h-screen flex-col bg-white lg:flex-row'>
      {/* Left: Login Section */}
      <div className='flex w-full flex-col justify-center px-6 '>
        <div className='mx-auto w-full max-w-md'>
          {/* Logo */}
          <div className='mb-3 flex justify-center'>
            <div className='flex justify-center rounded-xl bg-[#F6F6F6] p-2'>
              {/* <img
                src={'/logo.svg'}
                alt='Slide'
                className='w-[85%] max-w-md object-contain drop-shadow-lg'
              /> */}
            </div>
          </div>

          {/* Card Form */}
          <Card className='mb-5 shadow-md'>
            <CardHeader className='text-center'>
              <CardTitle className='text-2xl font-semibold'>Login</CardTitle>
              <CardDescription>
                Login with your credentials below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup className='gap-4'>
                  <Field>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field className='mb-0 pb-0'>
                    <div className='flex items-center'>
                      <FieldLabel htmlFor='password'>Password</FieldLabel>
                      <a
                        href='#'
                        className='ml-auto text-sm text-[#D81233] hover:underline'
                      >
                        Forgot password?
                      </a>
                    </div>
                    <PasswordInput
                      id='password'
                      placeholder='••••••••••'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </Field>
                  <div className='justify- mt-2 flex items-center'>
                    <label className='flex items-center space-x-2 text-sm text-gray-600'>
                      <input
                        type='checkbox'
                        id='rememberMe'
                        className='h-4 w-4 cursor-pointer rounded accent-[#D81233]'
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

                  {error && (
                    <Alert variant='destructive' className='mb-4'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>Login Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Field>
                    <LoadingButton
                      type='submit'
                      isLoading={isLoading}
                      className='w-full bg-[#292929] hover:bg-black'
                    >
                      Login
                    </LoadingButton>
                    <FieldDescription className='text-center'>
                      Don&apos;t have an account?{' '}
                      <a href='#' className='text-[#D81233] hover:underline'>
                        Sign up
                      </a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <FieldDescription className='mt-4 text-center text-sm'>
            By continuing, you agree to our{' '}
            <a href='#' className='text-[#D81233] hover:underline'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='#' className='text-[#D81233] hover:underline'>
              Privacy Policy
            </a>
            .
          </FieldDescription>
        </div>
      </div>

      {/* <div className='relative hidden items-center justify-center overflow-hidden lg:flex lg:w-[55%]'>
        <Image
          src='/loginScreen/login-background.svg'
          alt='Login Background'
          fill
          className='object-cover'
        />

        <div className='relative z-10 flex h-full w-full flex-col items-center justify-center'>
          <div className='relative flex w-full max-w-lg items-center justify-center'>
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt='Slide'
                  className='mb-6 w-[85%] max-w-md object-contain drop-shadow-lg'
                />
                <p className='text-center text-lg font-semibold text-white drop-shadow-md'>
                  {slide.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 transform gap-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div> */}
    </div>
  );
}
