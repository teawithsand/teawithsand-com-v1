export const shuffle = <T>(array: T[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

interface MapOpOption<K> {
    comparator?: (a: K, b: K) => number,
}

export const mapForEachSortedKeys = <K, V>(map: Map<K, V>, options: MapOpOption<K>, callback: (value: V, key: K, index: number) => void): void => {
    const keys = Array.from(map.keys())
    keys.sort(options.comparator)

    return keys.forEach((k, i) => callback(map.get(k), k, i))
}

export const mapMapSortedKeys = <K, V, E>(map: Map<K, V>, options: MapOpOption<K>, callback: (value: V, key: K, index: number) => E): E[] => {
    const keys = Array.from(map.keys())
    keys.sort(options.comparator)

    return keys.map((k, i) => callback(map.get(k), k, i))
}