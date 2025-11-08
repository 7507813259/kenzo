'use client';
import React from 'react';

export default function IconLoader() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/100'>
      {/* use below instead above div to remove full page background */}
      {/* <div className="flex flex-col items-center justify-center gap-4"> */}
      <div className='relative h-24 w-24'>
        <img
          src='/assets/icon.svg'
          alt='Icon outline'
          className='absolute inset-0 h-full w-full opacity-20'
        />
        <div
          className='absolute inset-0 h-full w-full'
          style={{
            maskImage: 'url(/assets/icon.svg)',
            WebkitMaskImage: 'url(/assets/icon.svg)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        >
          <div
            className='absolute bottom-0 left-0 w-full animate-[fill-up_0.9s_ease-out_forwards]'
            style={{
              background: 'linear-gradient(to top, #d81233, #8b0b20)'
            }}
          />
        </div>
      </div>
      <p className='animate-pulse text-sm font-medium text-slate-50'>
        Loading Kenzo 100% ...
      </p>
    </div>
  );
}
