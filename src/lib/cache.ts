import { QueryClient } from '@tanstack/react-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

// Cache keys for different entities
export const cacheKeys = {
  assets: ['assets'] as const,
  assetDetails: (id: string) => ['assets', id] as const,
  assetHistory: (id: string) => ['assets', id, 'history'] as const,
  barcodeScans: ['barcodeScans'] as const,
  impairmentRecords: ['impairmentRecords'] as const,
  leases: ['leases'] as const,
  wipAssets: ['wipAssets'] as const,
  shiftUsage: ['shiftUsage'] as const
}

// Prefetch functions for common data
export const prefetchCommonData = async () => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: cacheKeys.assets,
      queryFn: () => fetch('/api/assets').then(res => res.json())
    }),
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: () => fetch('/api/categories').then(res => res.json())
    }),
    queryClient.prefetchQuery({
      queryKey: ['locations'],
      queryFn: () => fetch('/api/locations').then(res => res.json())
    })
  ])
}

// Cache invalidation functions
export const invalidateAssetCache = async (assetId?: string) => {
  if (assetId) {
    await queryClient.invalidateQueries({ queryKey: cacheKeys.assetDetails(assetId) })
    await queryClient.invalidateQueries({ queryKey: cacheKeys.assetHistory(assetId) })
  } else {
    await queryClient.invalidateQueries({ queryKey: cacheKeys.assets })
  }
}