import React, { useEffect } from 'react'

export function useDebounceEffect(func: () => void, delay: number, deps: React.DependencyList) {
  useEffect(() => {
    const timer = setTimeout(func, delay)
    return () => clearTimeout(timer)
  }, deps)
}
