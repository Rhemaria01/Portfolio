import  {useState, useEffect, useRef} from 'react'

const useIsInViewport = (options: {
    root: null,
    rootMargin: string,
    treshhold: number
}) => {
  const containerRef = useRef(null)
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [intersected,setIntersected] = useState(false)
    const callBackFunction: IntersectionObserverCallback  = (entries: IntersectionObserverEntry[]) =>  {
      const [entry] = entries
      setIsIntersecting(entry.isIntersecting)

    }

  
    useEffect(() => {
      const observer = new IntersectionObserver(callBackFunction, options)
      
      if (containerRef.current) observer.observe(containerRef.current)
      if(isIntersecting) setIntersected(true)
      return () => {
        if (containerRef.current) observer.unobserve(containerRef.current)
      }
    }, [containerRef, options]);
  
    return [containerRef, intersected]
}

export default useIsInViewport