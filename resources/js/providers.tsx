import * as React from 'react';
import { SearchProvider } from '@/context/search-context';
import { ThemeProvider } from '@/context/theme-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';

import { NuqsAdapter } from '@/lib/nuqs';
import { queryClient } from '@/lib/react-query';

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: any) {
    return (
        <HelmetProvider>
            <NuqsAdapter>
                <QueryClientProvider client={queryClient}>
                    <SearchProvider>
                        <ThemeProvider defaultTheme="light" storageKey="app-ui-theme">
                            <TooltipProvider>{children}</TooltipProvider>

                            <Toaster />
                        </ThemeProvider>
                    </SearchProvider>

                    {/* Devtools */}
                    <ReactQueryDevtools buttonPosition={'bottom-right'} />
                </QueryClientProvider>
            </NuqsAdapter>
        </HelmetProvider>
    );
}
