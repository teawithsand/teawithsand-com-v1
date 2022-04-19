export function memorizeNoArgs(): any {
    // this is actual decorator
    // parent is factory
    return <T>(fn: () => T) => {
        let isComptued = false
        let cachedValue: any = null

        return () => {
            if (isComptued)
                return cachedValue as any

            cachedValue = fn()
            isComptued = true

            return cachedValue as any
        }
    }
}