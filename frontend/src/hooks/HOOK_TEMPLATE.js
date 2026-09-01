// Example custom hook
// Location: hooks/useHookName.js

import { useState, useEffect } from 'react'

export function useHookName() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Your hook logic here
  }, [])

  return { data, loading, error }
}
