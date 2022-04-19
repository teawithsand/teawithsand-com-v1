import { useEffect, useRef } from "react"
import { RefObject } from "react"

/**
 * Creates react's ref, which is used to determine whether or not is component still mounted.
 * It can be used to prevent modifiyng stuff once react component is gone.
 */
export const useIsMounted = (): RefObject<boolean> => {
    const isMounted = useRef(true)

    // set isMounted to false when we unmount the component
    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    return isMounted 
}