import { useEffect, useState } from "react"

const useDebounceHook = ( value: string, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState<string>("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(timeout)
    }
  })
  return debouncedValue;
}

export default useDebounceHook
