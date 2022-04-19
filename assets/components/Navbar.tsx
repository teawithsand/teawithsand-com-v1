import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import logo from "@app/images/tws.png"
import { Link, useNavigate } from "react-router-dom"
import { FormattedMessage, useIntl } from "react-intl"
import { LinkContainer } from "react-router-bootstrap"
import { userDataSelector } from "@app/actions/userAction"
import { logoutUser } from "@app/domain/user/login"
import { persistor } from "@app/actions/store"
import { loggedOutToast } from "@app/domain/toast/commonToast"
import { changePasswordPath, createWordSetPath, homePath, initForgottenPasswordPath, listOwnedWordSetPath, listPublicWordSetPath, loginPath, profileInfoPath, registerPath } from "@app/pages/urls"
import ImageUtil from "./util/ImageUtil"

export default () => {
    // const theme = useSelector(themeSelector);
    const userData = useSelector(userDataSelector)
    const intl = useIntl()
    const navigate = useNavigate()

    const dispatch = useDispatch()

    let userRightPart
    if (userData !== null) {
        /*
        userRightPart = <Nav>
            <LinkContainer to={profileInfoPath(userData.id, { type: "private" })}>
                <Nav.Link>
                    {
                        <FormattedMessage
                            id="navbar.user.my_profile"
                            values={{
                                publicName: userData.publicName,
                            }}
                        />
                    }
                </Nav.Link>
            </LinkContainer>
            <Nav.Link onClick={() => {
                dispatch(logoutUser().action)
                dispatch(loggedOutToast(intl).action)

                // make sure that logout was done ASAP
                persistor.flush()
            }}>
                {
                    <FormattedMessage
                        id="navbar.user.logout"
                        values={{
                            publicName: userData.publicName,
                        }}
                    />
                }
            </Nav.Link>
        </Nav>
        */
        userRightPart = <Nav>
            <NavDropdown title={intl.formatMessage({ id: "component.navbar.logged_in.options" })}>
                <NavDropdown.Item onClick={() => {
                    dispatch(logoutUser().action)
                    dispatch(loggedOutToast(intl).action)

                    // make sure that logout was done ASAP
                    persistor.flush()
                    navigate(homePath())
                }}>
                    <FormattedMessage id="component.navbar.logged_in.logout" />
                </NavDropdown.Item>


                <LinkContainer to={profileInfoPath(userData.id, { type: "secret" })}>
                    <NavDropdown.Item>
                        <FormattedMessage id="component.navbar.logged_in.my_profile" />
                    </NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to={changePasswordPath()}>
                    <NavDropdown.Item>
                        <FormattedMessage id="component.navbar.logged_in.change_password" />
                    </NavDropdown.Item>
                </LinkContainer>
            </NavDropdown>
        </Nav>
    } else {
        userRightPart = <Nav>
            <NavDropdown title={intl.formatMessage({ id: "component.navbar.not_logged_in" })}>
                <LinkContainer to={loginPath()}>
                    <NavDropdown.Item>
                        <FormattedMessage id="component.navbar.login" />
                    </NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to={registerPath()}>
                    <NavDropdown.Item>
                        <FormattedMessage id="component.navbar.register" />
                    </NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to={initForgottenPasswordPath()}>
                    <NavDropdown.Item>
                        <FormattedMessage id="component.navbar.forgotten_password" />
                    </NavDropdown.Item>
                </LinkContainer>
            </NavDropdown>
        </Nav>
    }

    return <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand>
                    <Link to="/">
                        <ImageUtil
                            src={logo}
                            className="d-inline-block align-top navbar--logo"
                            alt={
                                intl.formatMessage({ id: "navbar.logo.alt" })
                            } />
                    </Link>
                </Navbar.Brand>

                <Nav className="d-inline-block ms-auto me-auto">
                    <LinkContainer to="/">
                        <Nav.Link>
                            <FormattedMessage id="navbar.brand_name" />
                        </Nav.Link>
                    </LinkContainer>
                </Nav>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" role="">
                    <Nav className="me-auto">
                        {/*
                        <LinkContainer to="/">
                            <Nav.Link>
                                <FormattedMessage id="navbar.home" />
                            </Nav.Link>
                        </LinkContainer>
                        */}
                        <LinkContainer to="/about-me">
                            <Nav.Link>
                                <FormattedMessage id="navbar.about_me" />
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/portfolio">
                            <Nav.Link>
                                <FormattedMessage id="navbar.portfolio" />
                            </Nav.Link>
                        </LinkContainer>

                        <NavDropdown title={intl.formatMessage({ id: "component.navbar.langka.dropdown_title", defaultMessage: "Langka" })}>
                            <LinkContainer to={createWordSetPath()}>
                                <NavDropdown.Item>
                                    <FormattedMessage id="component.navbar.langka.create_word_set" />
                                </NavDropdown.Item>
                            </LinkContainer>

                            <LinkContainer to={listPublicWordSetPath()}>
                                <NavDropdown.Item>
                                    <FormattedMessage id="component.navbar.langka.list_public_word_set" />
                                </NavDropdown.Item>
                            </LinkContainer>

                            <LinkContainer to={listOwnedWordSetPath()}>
                                <NavDropdown.Item>
                                    <FormattedMessage id="component.navbar.langka.list_own_word_set" />
                                </NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                    </Nav>
                    {userRightPart}
                    {/*
                    <Nav className="me-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#deets">More deets</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Dank memes
                        </Nav.Link>
                    </Nav>
                    */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <div className="mb-5"></div>
    </>
}