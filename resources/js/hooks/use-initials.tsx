import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string): string => {
        const names = fullName;

        return `${names}`.toUpperCase();
    }, []);
}
