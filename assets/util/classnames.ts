/**
 * Concatenates multiple class names and performs uniquization.
 */
export default (...classNameSource: (string | undefined | null)[]) => {
    const classSet = new Set

    return classNameSource
        .flatMap(s => s ? s.split(/\s+/) : [])
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .filter(c => {
            const res = !classSet.has(c)
            classSet.add(c)
            return res
        })
        .join(" ")
}

