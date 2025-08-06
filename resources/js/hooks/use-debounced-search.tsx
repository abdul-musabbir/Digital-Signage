import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { debounce, isEqual, pickBy } from 'lodash';

import { DebouncedSearchReturn, SearchParams } from '@/components/types/types';

// Custom hook to track previous value
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

// Utility function to clean empty values from params
const cleanParams = (params: SearchParams): SearchParams => {
    return pickBy(params, (value) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== '' && value !== null && value !== undefined;
    });
};

// Utility function to serialize params for comparison
const serializeParams = (params: SearchParams): string => {
    return JSON.stringify(cleanParams(params));
};

interface UseDebouncedSearchOptions {
    initialTimeDebounce?: number;
    preserveState?: boolean;
    preserveScroll?: boolean;
    replace?: boolean;
    onStart?: () => void;
    onFinish?: () => void;
    onError?: (error: any) => void;
}

const useDebouncedSearch = (url: string, initialParams: SearchParams = {}, options: UseDebouncedSearchOptions = {}): DebouncedSearchReturn => {
    const { initialTimeDebounce = 300, preserveState = true, preserveScroll = true, replace = true, onStart, onFinish, onError } = options;

    // State management
    const [params, setParams] = useState<SearchParams>(initialParams);
    const [timeDebounce, setTimeDebounce] = useState(initialTimeDebounce);
    const [isLoading, setIsLoading] = useState(false);

    // Refs for tracking
    const prevParamsRef = useRef<string>();
    const abortControllerRef = useRef<AbortController>();
    const searchTimeoutRef = useRef<number>();

    // Memoized search function with debouncing
    const debouncedSearch = useCallback(
        debounce((searchParams: SearchParams) => {
            // Cancel any pending requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            const cleanedParams = cleanParams(searchParams);

            setIsLoading(true);
            onStart?.();

            router.get(url, cleanedParams, {
                replace,
                preserveState,
                preserveScroll,
                queryStringArrayFormat: 'indices',
                onSuccess: () => {
                    setIsLoading(false);
                    onFinish?.();
                },
                onError: (error) => {
                    setIsLoading(false);
                    onError?.(error);
                },
                onFinish: () => {
                    setIsLoading(false);
                    onFinish?.();
                },
            });
        }, timeDebounce),
        [url, timeDebounce, replace, preserveState, preserveScroll, onStart, onFinish, onError],
    );

    // Effect to handle parameter changes
    useEffect(() => {
        const currentParamsSerialized = serializeParams(params);
        const prevParamsSerialized = prevParamsRef.current;

        // Only search if params have actually changed and we have previous params
        if (prevParamsSerialized && currentParamsSerialized !== prevParamsSerialized) {
            // Clear existing timeout
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            // Set new timeout for search
            searchTimeoutRef.current = setTimeout(() => {
                debouncedSearch(params);
            }, timeDebounce);
        }

        // Update previous params reference
        prevParamsRef.current = currentParamsSerialized;

        // Cleanup function
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [params, timeDebounce, debouncedSearch]);

    // Effect to recreate debounced function when timeDebounce changes
    useEffect(() => {
        debouncedSearch.cancel();
    }, [timeDebounce]);

    // Enhanced setParams with validation and optimization
    const enhancedSetParams = useCallback((newParams: SearchParams) => {
        setParams((prevParams) => {
            // Deep comparison to avoid unnecessary updates
            if (isEqual(prevParams, newParams)) {
                return prevParams;
            }

            // Reset to first page when filters change (except for page changes)
            const shouldResetPage =
                newParams.search !== prevParams.search ||
                !isEqual(newParams.filters, prevParams.filters) ||
                newParams.sort !== prevParams.sort ||
                newParams.direction !== prevParams.direction;

            const finalParams = shouldResetPage && newParams.page === prevParams.page ? { ...newParams, page: 1 } : newParams;

            return finalParams;
        });
    }, []);

    // Enhanced setTimeDebounce with validation
    const enhancedSetTimeDebounce = useCallback((time: number) => {
        const validatedTime = Math.max(0, Math.min(5000, time)); // Clamp between 0-5000ms
        setTimeDebounce(validatedTime);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [debouncedSearch]);

    return {
        params,
        setParams: enhancedSetParams,
        setTimeDebounce: enhancedSetTimeDebounce,
        isLoading,
    };
};

export default useDebouncedSearch;
