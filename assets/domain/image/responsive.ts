export interface ResponsiveImageEntry {
    src: string,
    width: number,
    height: number,
}

export interface ResponsiveImage {
    src: string,
    srcSet: string,
    images: ResponsiveImageEntry[],
}