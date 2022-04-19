import { getRecaptchaV2PublicToken } from "@app/util/captcha"
import { useIsMounted } from "@app/util/mountedHook"
import * as React from "react"


// TODO(teawithsand): add site key as property, rather than some global
//  or use react hook for this purpose
export default (
    props: {
        theme?: "light" | "dark",
        onToken?: (token: string) => void,
        onExpired?: () => void,
        onError?: () => void,
    }
) => {
    const divRef = React.useRef()

    // wow calling use ref with argument here does not work
    // but setting current value below works just fine
    // apparently it does initialization if no value is set
    // then given one is set
    // otherwise it's noop...
    const callbacksRef = React.useRef<any>()
    callbacksRef.current = {
        onToken: props.onToken,
        onError: props.onError,
        onExpired: props.onExpired,
    }

    const renderedIdRef = React.useRef(null)

    // const { onChanged, onError, onExpired } = props

    /*
    const onChanged = props.onChanged ? React.useCallback(props.onChanged, [props.onChanged]) : undefined
    const onError = props.onError ? React.useCallback(props.onError, [props.onError]) : undefined
    const onExpired = props.onExpired ? React.useCallback(props.onExpired, [props.onExpired]) : undefined
    */

    const renderRecaptcha = () => {
        if (divRef.current && renderedIdRef.current === null) {
            renderedIdRef.current = grecaptcha.render(divRef.current, {
                sitekey: getRecaptchaV2PublicToken(),
                callback: (token: string) => {
                    const v = callbacksRef.current
                    if (v.onToken)
                        v.onToken(token)
                },
                "expired-callback": () => {
                    const v = callbacksRef.current
                    if (v.onExpired)
                        v.onExpired()
                },
                "error-callback": () => {
                    const v = callbacksRef.current
                    if (v.onError)
                        v.onError()
                },
            })
        }
    }

    const cleanupRecaptcha = () => {
        if (window.grecaptcha && window.grecaptcha.reset && renderedIdRef.current !== null) {
            window.grecaptcha.reset(renderedIdRef.current)
            renderedIdRef.current = null
        }
    }

    React.useEffect(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
            renderRecaptcha()
            return () => {
                cleanupRecaptcha()
            }
        } else {
            // async script was not loaded yet
            // so instead of using some global callbacks
            // use approach, which requires less interaction from user
            // and does not integrate with csp as badly as manual injecting of script tag

            // use interval of 500ms to check if recaptcha stuff has been loaded already or not
            let interval: any = null
            interval = setInterval(() => {
                if (window.grecaptcha && window.grecaptcha.render) {
                    if (interval !== null) {
                        clearInterval(interval)
                        interval = null
                    }

                    renderRecaptcha()
                }
            }, 500)

            return () => {
                if (interval !== null) {
                    clearInterval(interval)
                    interval = null
                }

                // in case it was rendered
                cleanupRecaptcha()
            }
        }
    },
        [] // rerender recaptcha as rarely as possible, so we do not lose checked mark if user does nothing to cancel it
    )

    return <div ref={divRef} data-sitekey={getRecaptchaV2PublicToken()}></div>
}