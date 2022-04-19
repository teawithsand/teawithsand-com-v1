import { useState, useEffect } from 'react';

export type Orientation = "vertical" | "horiziontal" | "square"
export type WindowDimensions = {
    width: number,
    height: number,
    orientation: Orientation,
}

function getWindowDimensions(): WindowDimensions {
    const { innerWidth: width, innerHeight: height } = window;
    let orientation: Orientation = "square"
    if (width > height) {
        orientation = "horiziontal"
    } else if (height > width) {
        orientation = "vertical"
    }
    return {
        width,
        height,
        orientation,
    }
}

export default function useWindowDimensions(): WindowDimensions {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
}