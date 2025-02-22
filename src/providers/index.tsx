'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LayerCardProvider from './LayerCardProvider';
import LayerPopupProvider from './LayerPopupProvider';

import ProviderProps from './types';

const queryClient = new QueryClient();

const Providers = ({ children }: ProviderProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <LayerPopupProvider>
            <LayerCardProvider>{children}</LayerCardProvider>
          </LayerPopupProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
