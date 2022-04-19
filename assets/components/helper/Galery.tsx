import { ResponsiveImage } from "@app/domain/image/responsive"
import React, { useEffect, useRef, useState } from "react"
import ImageUtil from "../util/ImageUtil"
import classnames from "@app/util/classnames"

import fullscreenImage from "@app/images/svgrepo/fullscreen.svg"
import { GalleryImage } from "./NewGallery"


/**
 * @deprecated use new gallery instead
 */
export default (props: {
    images: GalleryImage[],
}) => {
    const { images } = props

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFirstActiveImage, setIsFirstActiveImage] = useState(true)

    const [shownImages, setShownImages] = useState([currentImageIndex])

    const [isFullscreen, setIsFullscreen] = useState(false)

    const bottomBarRef = useRef<any>()
    const isBottomBarVisibleOnScreenRef = useRef(false)

    const isFullscreenRef = useRef(false)
    const enterFullscreen = () => {
        isFullscreenRef.current = true
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        }
    }
    const exitFullscreen = () => {
        if (isFullscreenRef.current && document.exitFullscreen) {
            isFullscreenRef.current = false
            document.exitFullscreen()
        }
    }


    useEffect(() => {
        if (bottomBarRef.current) {
            const observer = new IntersectionObserver(function (entries) {
                // isIntersecting is true when element and viewport are overlapping
                // isIntersecting is false when element and viewport don't overlap
                isBottomBarVisibleOnScreenRef.current = entries[0].isIntersecting
            }, { threshold: [1] });

            observer.observe(bottomBarRef.current)


            return () => {
                observer.disconnect()
            }
        }
        return () => {
        }
    }, [bottomBarRef.current])

    useEffect(() => {
        const listener = (e: any) => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false)
                // exitFullscreen()
            }

        }
        window.addEventListener("fullscreenchange", listener)

        return () => {
            window.removeEventListener("fullscreenchange", listener)
        }
    }, [])

    // Scrolls bottom slider if required
    useEffect(() => {
        if (bottomBarRef.current) {
            const target = bottomBarRef.current.childNodes[currentImageIndex]
            if (isBottomBarVisibleOnScreenRef.current) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                })
            }
        }
    }, [bottomBarRef.current, currentImageIndex])

    const goToIthImage = (newImageIndex: number) => {
        if (newImageIndex !== currentImageIndex) {
            setIsFirstActiveImage(false)
            setCurrentImageIndex(newImageIndex)

            if (!shownImages.some(e => e === newImageIndex))
                setShownImages([...shownImages, newImageIndex])
        }
    }

    const goToNextImage = () => {
        const newImageIndex = (currentImageIndex + 1) % images.length
        goToIthImage(newImageIndex)
    }

    const goToPrevImage = () => {
        let newImageIndex = currentImageIndex - 1
        if (newImageIndex < 0)
            newImageIndex = images.length - 1

        goToIthImage(newImageIndex)
    }

    const toggleFullscreen = (to?: boolean) => {
        to = to ?? !isFullscreen
        if (to) {
            enterFullscreen()
        } else {
            exitFullscreen()
        }
        setIsFullscreen(to)
    }

    let baseImageStyle = "gallery__image"

    const firstActiveImage = classnames(baseImageStyle, "gallery__image--initial-active", isFullscreen ? "" : "cursor-pointer")
    const activeImage = classnames(baseImageStyle, "gallery__image--active gallery__animation-fade-in", isFullscreen ? "" : "cursor-pointer")

    const inactiveImage = classnames(baseImageStyle, "gallery__image--inactive gallery__animation-fade-out")
    const firstInactiveImage = classnames(baseImageStyle, "gallery__image--initial-inactive")

    let rootClassName = "gallery"
    if (isFullscreen) {
        rootClassName = classnames(rootClassName, "gallery--fullscreen")
    }

    return <div className={rootClassName}>
        <div className="gallery__controls-top">
            <div className="text-start w-100">
                {currentImageIndex + 1}/{images.length}
            </div>
            <div className="text-center w-100">
                {images[currentImageIndex].title ?? null}
            </div>
            <div className="text-end w-100">
                {isFullscreen ?
                    <div className="gallery__exit-icon text-noselect cursor-pointer d-inline"
                        onClick={() => {
                            toggleFullscreen()
                        }}
                    >
                        X
                    </div>
                    : <div className="text-noselect cursor-pointer d-inline"
                        onClick={() => {
                            toggleFullscreen()
                        }}
                    >
                        <ImageUtil
                            className="gallery__fullscreen-icon d-inline"
                            src={fullscreenImage}
                        />
                    </div>}
            </div>
        </div>

        <div className="gallery__center-row" style={{
            // height: height - 100,
        }}>
            <div className="gallery__controls-left"
                onClick={() => goToPrevImage()}
            >
                <div className="mt-auto mb-auto">
                    {"<"}
                </div>
            </div>

            <div className="gallery__image-container">
                {
                    images.map((img, idx) => {
                        if (idx === currentImageIndex) {
                            return <ImageUtil
                                key={idx.toString() + "_" + img.source.src}
                                onClick={() => {
                                    if (!isFullscreen)
                                        toggleFullscreen()
                                }}
                                className={isFirstActiveImage ? firstActiveImage : activeImage}
                                src={images[idx].source} />
                        } else {
                            return <ImageUtil
                                key={idx.toString() + "_" + img.source.src}
                                onClick={() => {
                                    if (!isFullscreen)
                                        toggleFullscreen()
                                }}
                                className={!shownImages.some(e => e === idx) ? firstInactiveImage : inactiveImage}
                                fluid={true}
                                src={images[idx].source} />
                        }
                    })
                }
            </div>

            <div
                className="gallery__controls-right"
                onClick={() => goToNextImage()}
            >
                <div className="mt-auto mb-auto">
                    {">"}
                </div>
            </div>
        </div>

        <div
            className="gallery__controls-bottom"
            ref={bottomBarRef}
        >
            {
                images.map((img, idx) => {
                    let className = classnames("gallery__image-thumbnail")
                    if (idx === currentImageIndex) {
                        className = classnames(className, "gallery__image-thumbnail--active")
                    }
                    return <ImageUtil
                        onClick={() => {
                            goToIthImage(idx)
                        }}
                        className={className}
                        key={idx.toString() + "_" + img.source.src}
                        src={images[idx % images.length].source} />
                })
            }
        </div>
    </div>
}