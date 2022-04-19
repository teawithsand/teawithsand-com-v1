import { Image } from "react-bootstrap"
import { ResponsiveImage } from "@app/domain/image/responsive"
import * as React from "react"

/**
 * Either URL or responsive image.
 */
export type ImageSource = string | ResponsiveImage

/**
 * Element, which wraps standard HTML img element.
 */
export default (
    props: {
        src: ImageSource,
        className?: string,
        style?: React.StyleHTMLAttributes<HTMLImageElement>,
        alt?: string,

        onClick?: () => void,

        width?: number,
        height?: number,

        fluid?: boolean,
        rounded?: boolean,
        roundedCircle?: boolean,
        thumbnail?: boolean,
    }
) => {
    let src: string | undefined = undefined
    let srcSet: string | undefined = undefined
    const image = props.src
    if (typeof image === "string") {
        src = image
    } else {
        src = image.src
        srcSet = image.srcSet
    }

    return <Image
        onClick={props.onClick}
        src={src}
        srcSet={srcSet}
        style={props.style}
        alt={props.alt}
        className={props.className}
        fluid={props.fluid}
        rounded={props.rounded}
        thumbnail={props.thumbnail}
        width={props.width}
        height={props.height}
    />
}