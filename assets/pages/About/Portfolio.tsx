import React, { useMemo, useState } from "react"
import { Button, ButtonGroup, Card, Col, Collapse, Container, Row } from "react-bootstrap"
import { FormattedMessage } from "react-intl"

import screenZero from "@app/static/palmabooks/screen-0.jpg"
import screenOne from "@app/static/palmabooks/screen-1.jpg"
import screenTwo from "@app/static/palmabooks/screen-2.jpg"
import screenThree from "@app/static/palmabooks/screen-3.jpg"
import screenFour from "@app/static/palmabooks/screen-4.jpg"
import screenFive from "@app/static/palmabooks/screen-5.jpg"
import screenSix from "@app/static/palmabooks/screen-6.jpg"
import screenSeven from "@app/static/palmabooks/screen-7.jpg"
import Galery from "@app/components/helper/Galery"

import Palmabooks2LatestAPK from "@app/static/palmabooks/palmabooks2_latest.apk"
import { aboutMePath, homePath } from "../urls"
import { Link } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import NewGallery, { GalleryImage } from "@app/components/helper/NewGallery"

export default () => {
    const galleryImages: GalleryImage[] = useMemo(() => {
        const images = [
            screenZero,
            screenOne,
            screenTwo,
            screenThree,
            screenFour,
            screenFive,
            screenSix,
            screenSeven,
        ]
        return images.map((s) => ({
            source: s
        }))
    }, [])

    const [isShowPalmabooks2Gallery, setIsShowPalmabooks2Gallery] = useState(false)
    const [isShowPalmabooks2More, setIsShowPalmabooks2More] = useState(false)

    const [isShowPalmabooksComMore, setIsShowPalmabooksComMore] = useState(false)
    const [isShowTeawithsandComMore, setIsShowTeawithsandComMore] = useState(false)

    return <Container>
        <Row className="mb-3">
            <Col className="text-center">
                <h1>
                    <FormattedMessage id="page.about.portfolio.title" />
                </h1>
                <h6>Note: this page is available only in English</h6>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <h3>
                    Useful links
                </h3>
                <ButtonGroup>
                    <Button href="https://github.com/teawithsand" target="_blank">
                        GitHub
                    </Button>
                    <Button href="https://www.linkedin.com/in/teawithsand" target="_blank">
                        LinkedIn
                    </Button>
                    <LinkContainer to={aboutMePath()}>
                        <Button href="#" target="_blank">
                            About me
                        </Button>
                    </LinkContainer>
                </ButtonGroup>

                <p>

                </p>
                <h2>
                    Created projects
                </h2>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <h2>teawithsand.com website(this one)</h2>
                        </Card.Title>
                        <p>
                            Aside from being a portfolio, I wanted this website to be playground for my ideas,
                            since implementing multiple functionalities in single codebase requires less work than creating new project.

                            More info about features is on <Link to={homePath()}>home page</Link>.
                        </p>
                        <p>
                            Technologies used: <b>PHP</b>, <b>Symfony 6</b>, <b>Postgres</b>, <b>Typescript</b>, <b>JavaScript</b>, <b>React</b>, <b>Bootstrap 5</b>
                        </p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <h2>PalmABooks / PalmABooks2 ABook player</h2>
                        </Card.Title>
                        <div>
                            <p>
                                PalmABooks and PalmABooks2 are native android audiobook players written java and kotlin.
                                Both are not maintained anymore and do not work on latest Android versions, which was the reason why they were removed from Google Play.
                            </p>
                            <p>
                                App also had small Spring Boot backend, which scrapped{" "}
                                <a target="_blank" href="https://librivox.org/api/info">librivox</a> and{" "}
                                <a href="https://wolnelektury.pl/api/" target="_blank">wolnelektury.pl</a> APIs, stored them in Postgres and
                                exposed simple REST API, which android app could query for free ABooks.
                            </p>
                            <p>
                                Technologies used: <b>Android SDK</b>, <b>Kotlin</b>, <b>Java</b>, <b>Spring Boot</b>, <b>Postgres</b>
                            </p>

                            <Collapse in={isShowPalmabooks2More}>
                                <div>
                                    <p>
                                        Along with PalmABooks application was in development between January 2017 and February of 2019.
                                        The PalmABooks was first published at google play at 15.02.2018. During that time app has reached over 1000 downloads on google play store.
                                    </p>

                                    <p>
                                        It implements lot's of features like:
                                    </p>
                                    <ul>
                                        <li>Integration with backend API and simple UI to query it</li>
                                        <li>Sleep functionality - automatic pause after chosen period of time, also pause that slowly turns down volume until it reaches actual pause</li>
                                        <li>Sleep reset, once user shakes device</li>
                                        <li>Changing playback speed - between x0.5 and x4</li>
                                        <li>Saving position in book - after you close app and open again it will start playing at position that was saved before exit app, every book's position is tracked independently</li>
                                        <li>Configurable buttons, they might change file or jump by 5s up to 10m</li>
                                        <li>Bookmarks - simple notes with position in book</li>
                                        <li>Configurable sorting of sound files - support for filenames like 1.mp3, 2.mp3... 10.mp3 in proper order</li>
                                        <li>Widget</li>
                                        <li>Support for formats: .mp3, .m4a, .wmv, .wav, .ogg, .m4b</li>
                                    </ul>
                                </div>
                            </Collapse>
                        </div>
                        <div className="mb-2">
                            <ButtonGroup>
                                <Button onClick={() => setIsShowPalmabooks2More(!isShowPalmabooks2More)}>{isShowPalmabooks2More ? "Show less" : "Show more"}</Button>
                                <Button onClick={() => setIsShowPalmabooks2Gallery(!isShowPalmabooks2Gallery)}>{
                                    isShowPalmabooks2Gallery ? "Hide screens" : "Show screens"
                                }</Button>
                                <Button href={Palmabooks2LatestAPK} {...{
                                    download: "PalmABooks2_Latest.apk"
                                } as any}>
                                    Download APK
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div>
                            <Collapse in={isShowPalmabooks2Gallery}>
                                <div>
                                    <NewGallery
                                        images={galleryImages}
                                    />
                                </div>
                            </Collapse>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <h2>palmabooks.com blog post aggregator</h2>
                        </Card.Title>
                        <p>
                            palmabooks.com was website, which aggregated blog posts about books using RSS feeds,
                            which are generated automatically by most blogging software.

                            {" "}
                            <a href="https://web.archive.org/web/20180307161225/https://palmabooks.com/" target="_blank">
                                Now it's available only at archive.org
                            </a>
                        </p>
                        <p>
                            Note: it's not the backend, which handled scrapping <a target="_blank" href="https://librivox.org/api/info">librivox.org</a>
                            /
                            <a href="https://wolnelektury.pl/api/" target="_blank">wolnelektury.pl</a> APIs. It was separate application.
                        </p>
                        <p>
                            Technologies used: <b>PHP</b>, <b>Symfony</b>, <b>JavaScript</b>, <b>JQuery</b>, <b>Bootstrap</b>, <b>Postgres</b>, <b>Doctrine ORM</b>
                        </p>
                        <Collapse in={isShowPalmabooksComMore}>
                            <div>
                                It implemented features like:
                                <ul>
                                    <li>
                                        User login / registration in classical email + password way.
                                    </li>
                                    <li>
                                        Login via facebook.
                                    </li>
                                    <li>
                                        Basic user management routines: changing email, changing password, reseting forgotten password and deleting account.
                                    </li>
                                    <li>
                                        Tracking and grayscalling already clicked blogposts
                                    </li>
                                    <li>
                                        Favourite blog list
                                    </li>
                                    <li>
                                        List of blogposts from favourite blogs
                                    </li>
                                    <li>
                                        Rating blog posts using stars(from 1 to 5).
                                    </li>
                                    <li>
                                        some management features, which allowed administrator to hide all posts or single post from given blog
                                        or to manually trigger RSS scrapping of specified blog.
                                    </li>
                                </ul>
                            </div>
                        </Collapse>

                        <ButtonGroup>
                            <Button onClick={() => setIsShowPalmabooksComMore(!isShowPalmabooksComMore)}>{isShowPalmabooksComMore ? "Show less" : "Show more"}</Button>
                        </ButtonGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <h2>Torut - tor controller written in rust</h2>
                        </Card.Title>
                        <p>
                            It's the only OSS that I've created, which got some adoption.{" "}
                            <a href="https://gitweb.torproject.org/torspec.git/tree/control-spec.txt" target="_blank">
                                It implements tor control protocol client</a>.
                            It's still passively maintained, which isn't hard since these specs hardly ever change.
                            Also high test coverage along with me doing some fuzzing makes bugs appear rarely.
                        </p>
                        <ButtonGroup>
                            <Button href="https://crates.io/crates/torut" target="_blank">
                                crates.io
                            </Button>
                            <Button href="https://github.com/teawithsand/torut" target="_blank">
                                GitHub
                            </Button>
                        </ButtonGroup>
                        <p></p>
                        <p>
                            Technologies used: <b>Rust</b>
                        </p>
                        {/*
                        <Collapse in={isShowTeawithsandComMore}>
                            <div>
                                <p>
                                    After developing numerous small web projects, I've decided to created website, which integrates these in single codebase.
                                </p>
                            </div>
                        </Collapse>

                        <ButtonGroup>
                            <Button onClick={() => setIsShowTeawithsandComMore(!isShowTeawithsandComMore)}>{isShowTeawithsandComMore ? "Show less" : "Show more"}</Button>
                        </ButtonGroup>
                        */}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}