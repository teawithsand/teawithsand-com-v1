import * as React from "react"
import { Button, ButtonGroup, Card, Col, Container, Row } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate } from "react-router"
import { listPublicWordSetPath, loginPath, portfolioPath, registerPath } from "./urls"

const HomeEN = () => {
    const navigate = useNavigate()

    return <div>
        <Row className="text-center mb-3">
            <Col>
            </Col>
        </Row>
        <Row className="text-center mb-3">
            <Col>
            </Col>
        </Row>
        <Row>
            <Col className="mb-3" md>
                <Card className="h-100">
                    <Card.Body>
                        <Card.Title>
                            <h3>Portfolio</h3>
                        </Card.Title>

                        <p>
                            And links to GitHub/LinkedIn.
                        </p>

                        <Button onClick={() => {
                            navigate(portfolioPath())
                        }}>See portfolio</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col className="mb-3" md>
                <Card className="h-100">
                    <Card.Body>
                        <Card.Title>
                            <h3>Login/Register</h3>
                        </Card.Title>

                        <p>
                            In order to edit content's registration is needed.
                        </p>
                        <p>
                            Note: for now registration does not work, since I have to make it compliant with GDRP like write rules, privacy policy and stuff.
                        </p>

                        <ButtonGroup>
                            <Button onClick={() => {
                                navigate(loginPath())
                            }}>Login</Button>
                            <Button disabled onClick={() => {
                                navigate(registerPath())
                            }}>Register</Button>
                        </ButtonGroup>
                    </Card.Body>
                </Card>
            </Col>
            <Col className="mb-3" md>
                <Card className="h-100">
                    <Card.Body>
                        <Card.Title>
                            <h3>Langka</h3>
                        </Card.Title>

                        <p>
                            Langka's simple tool for language learning.
                            It allows storing words and their meaning in word sets and then browsing them in a simple game, where
                            you have to memorize it's meaning.
                        </p>

                        <Button onClick={() => {
                            navigate(listPublicWordSetPath())
                        }}>Browse public word sets</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>

    </div>
}

const HomePL = () => {
    return <div>

    </div>
}

export default () => {
    const intl = useIntl()

    return <Container className="text-responsive">
        <span className="text-center">
            <h1><FormattedMessage id="page.home.title" /></h1>
            <h6><FormattedMessage id="page.home.subtitle" /></h6>
            <hr className="plain" />
        </span>
        {intl.locale === "pl" && false ? <HomePL /> : <HomeEN />}
    </Container>
}