import React from "react"
import { WordSetPublicSummary, WordSetSecretSummary } from "@app/domain/langka/definitons"
import { Button, ButtonGroup, Card, Col, Container, Row, Table } from "react-bootstrap"
import { FormattedDate, FormattedMessage } from "react-intl"
import { defaultDateTimeFormatProps } from "@app/util/dateFormat"

export interface WordSetListCommonProps {
    onEditClick?: (summary: WordSetPublicSummary) => void,
    onShowClick?: (summary: WordSetPublicSummary) => void,
    // onDeleteClick?: (summary: WordSetPublicSummary) => void,
}

export interface WordSetListPublicProps extends WordSetListCommonProps {
    type: "public",
    data: WordSetPublicSummary[]
}

export interface WordSetListSecretProps extends WordSetListCommonProps {
    type: "secret",
    data: WordSetSecretSummary[]
}

export default (
    props: WordSetListPublicProps | WordSetListSecretProps
) => {
    const { data, type, onEditClick, onShowClick } = props

    const editable = !!props.onEditClick
    const showable = !!props.onShowClick
    // const deletable = !!props.onDeleteClick

    if (data.length === 0) {
        return <Container>
            <Row className="text-center">
                <Col>
                    <FormattedMessage id="component.langka.word_set_list.no_entries" />
                </Col>
            </Row>
        </Container>
    }

    const ButtonsRow = (props: {
        data: WordSetPublicSummary
    }) => {
        const { data } = props
        if (!editable && !showable)
            return null

        return <Row>
            <Col>
                <ButtonGroup className="w-100">
                    {showable ? <Button className="w-100" size="sm" variant="primary" onClick={() => onShowClick(data)}>
                        <FormattedMessage id="component.langka.word_set_list.table_entry.show" defaultMessage={"show"} />
                    </Button> : null}
                    {editable ? <Button className="w-100" size="sm" variant="secondary" onClick={() => onEditClick(data)}>
                        <FormattedMessage id="component.langka.word_set_list.table_entry.edit" defaultMessage={"edit"} />
                    </Button> : null}
                </ButtonGroup>
            </Col>
        </Row>
    }

    const cards = data.map((value, index) => <Row key={index}>
        <Col xs={12} lg={8} className="ms-auto me-auto">
            <Card className="mb-3" key={index}>
                <Card.Body>
                    <Card.Title>
                        {value.title} <span className="text-muted">
                            {value.sourceLanguage.toLocaleUpperCase()} {"=>"} {value.destinationLanguage.toLocaleUpperCase()}
                        </span>
                    </Card.Title>
                    <Row>
                        <Col>
                            <FormattedMessage id="component.langka.word_set_list.card.owner_prefix" defaultMessage={"Owner: "} />{value.owner.publicName}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <FormattedMessage id="component.langka.word_set_list.card.created_at_prefix" defaultMessage={"Created at: "} /><FormattedDate {...defaultDateTimeFormatProps} value={Date.parse(value.lifecycle.createdAt)} />
                        </Col>
                    </Row>
                    <ButtonsRow data={value} />
                </Card.Body>
            </Card>
        </Col>
    </Row>)

    return <Container>
        {cards}
    </Container>
}