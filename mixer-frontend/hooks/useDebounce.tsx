import {
  useCallback,
  // useDebugValue,
  useEffect,
  useState,
} from 'react'

const useDebounce = (callback:any, delay: number) => {
  let [timer, setTimer] = useState(null)
  const cb = useCallback(callback, [])

  const debounce = async (...args:any) => {
    clearTimeout(timer as any)
    //setTimer(setTimeout(() => cb(...args as any), delay))
  }

  useEffect(() => {
    return () => clearTimeout(timer as any)
  }, [])

  // useDebugValue({ cb, timer, delay })
  return debounce
}

export default useDebounce
