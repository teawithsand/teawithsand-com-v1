import ImageUtil from "@app/components/util/ImageUtil";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import me from "@app/images/tws.png"

export default () => {
    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1>
                    About me/Contact
                </h1>
                <h6>Note: this page is available only in English</h6>
            </Col>
        </Row>
        <Row>
            <Col>
                <h3>Contact</h3>
                <p>
                    For website-related subjects use:{" "}
                    <a href="mailto:admin@teawithsand.com">admin@teawithsand.com</a>
                </p>

                <p>
                    Otherwise use {" "}
                    <a href="mailto:teawithsand@gmail.com">teawithsand@gmail.com</a> {" "}or{" "}
                    <a href="mailto:kontakt@przemyslawglowacki.com">kontakt@przemyslawglowacki.com</a>
                </p>
            </Col>
            <Col sm={12} lg={8}>
                <h3>About me</h3>
                <p>
                    <ImageUtil
                        className="about-me__image ps-2"
                        fluid={true}
                        src={me} />
                    My name is Przemysław Głowacki and I make software because I like it.
                    Lately, I've decided that I needed some place to easily implement new ideas,
                    since I've created lots of projects that didn't made it into production,
                    because of amount of work that you have to put into application in order to even call it an application.
                </p>
                <p>
                    I also needed a portfolio page, so I've decided to make single one, so here it is.
                </p>

                <span className="clearfix"></span>


            </Col>
        </Row>
        <Row>
            <hr />
            <p>
                Changelog:
                <ul>
                    <li>27.02.2022: Website is published without register function</li>
                </ul>
            </p>
        </Row>
    </Container>
}