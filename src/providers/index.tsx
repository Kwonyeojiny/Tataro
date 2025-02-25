'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LayerCardProvider from './LayerCardProvider';
import LayerPopupProvider from './LayerPopupProvider';
import SubmenuProvider from './SubmenuProvider';

import ProviderProps from './types';
import { ACCESS_TOKEN_EXPIRY } from '@/app/login/constants';

const queryClient = new QueryClient();

const Providers = ({ children }: ProviderProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider refetchInterval={ACCESS_TOKEN_EXPIRY / 1000}>
          <SubmenuProvider>
            <LayerPopupProvider>
              <LayerCardProvider>{children}</LayerCardProvider>
            </LayerPopupProvider>
          </SubmenuProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
