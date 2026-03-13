import { useSyncExternalStore } from 'react';
import { getUserLibraryState, subscribeToUserLibrary } from '@/lib/user-library';

export function useUserLibrary() {
  return useSyncExternalStore(subscribeToUserLibrary, getUserLibraryState, getUserLibraryState);
}
