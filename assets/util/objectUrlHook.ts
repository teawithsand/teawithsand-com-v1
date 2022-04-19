import { useEffect, useRef } from "react"

export const useObjectUrl = (target: Blob | MediaSource): string => {
    const objectUrlRef = useRef<string>()
    if (!objectUrlRef.current) {
        objectUrlRef.current = URL.createObjectURL(target)
    }

    useEffect(() => {
        if (!objectUrlRef.current) {
            const objectUrl = URL.createObjectURL(target) as string
            objectUrlRef.current = objectUrl
        }

        return () => {
            URL.revokeObjectURL(objectUrlRef.current)
            objectUrlRef.current = ""
        }
    }, [target])

    return objectUrlRef.current
}