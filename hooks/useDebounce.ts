'use client'
import { useCallback, useRef } from 'react'

export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 1000): T {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pending = useRef(false)

  return useCallback((...args: any[]) => {
    if (pending.current) return
    pending.current = true
    fn(...args)
    timer.current = setTimeout(() => { pending.current = false }, delay)
  }, [fn, delay]) as T
}
