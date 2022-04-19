import { AcceptCookiesAction, acceptedCookiesSelector } from "@app/actions/cookiesAction"
import React from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { FormattedMessage } from "react-intl"
import { useDispatch, useSelector } from "react-redux"

const CookieBanner = () => {
    const isAcceptedCookies = useSelector(acceptedCookiesSelector)
    const dispatch = useDispatch()

    if (isAcceptedCookies) {
        return <div className="cookie-barnner cookie-banner--hidden"></div>
    }

    return <div className="cookie-banner">
        <div className="cookie-banner__text">
            <h3>
                <FormattedMessage id={"component.helper.cookie_banner.title"} defaultMessage={"This website uses cookies"} />
            </h3>
            <h6 className="text-secondary">
                <FormattedMessage id={"component.helper.cookie_banner.subtitle"} defaultMessage={"and other ways of storing data on user's device. They are required for this website to work properly."} />
            </h6>
        </div>
        <div className="cookie-banner__confirm">
            <ButtonGroup>
                {/*
                <Button onClick={() => {

                }} variant="outline-primary">
                    <FormattedMessage id={"component.helper.cookie_banner.more_info"} defaultMessage={"More info"} />
                </Button>
                */}
                <Button onClick={() => {
                    const action: AcceptCookiesAction = {
                        type: "TWSAPI/cookies/accept",
                    }
                    dispatch(action)
                }}>
                    <FormattedMessage id={"component.helper.cookie_banner.accept"} defaultMessage={"Accept and close"} />
                </Button>
            </ButtonGroup>
        </div>
    </div>
}

export default CookieBanner