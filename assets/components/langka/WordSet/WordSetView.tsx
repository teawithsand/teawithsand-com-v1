import { WordSetPublicDetails, WordSetSecretDetails, WordTupleSummary } from "@app/domain/langka/definitons"
import { Button, ButtonGroup, Col, Row } from "react-bootstrap"
import React from "react"
import { FormattedDate, FormattedMessage, useIntl } from "react-intl"
import WordTuplesView from "../WordTuple/WordTuplesView"
import { defaultDateTimeFormatProps } from "@app/util/dateFormat"
import { LinkContainer } from "react-router-bootstrap"
import { browseWordsGamePath } from "@app/pages/urls"

interface WordSetViewBaseProps {
    wordTuples?: WordTupleSummary[],

    onTupleEdit?: (tuple: WordTupleSummary) => void,
    onTupleDelete?: (tuple: WordTupleSummary) => void,
    onTupleCreate?: () => void,

    onWordSetEdit?: () => void,
    onWordSetDelete?: () => void,
    onWordSetPublish?: () => void,
}

export type WordSetViewPublicProps = {
    type: "public",
    wordSet: WordSetPublicDetails,
} & WordSetViewBaseProps

export type WordSetViewSecretProps = {
    type: "secret",
    wordSet: WordSetSecretDetails,
} & WordSetViewBaseProps

export default (props: WordSetViewPublicProps | WordSetViewSecretProps) => {
    const { wordSet, wordTuples, type, onWordSetDelete, onWordSetEdit, onTupleCreate, onWordSetPublish } = props
    const { lifecycle, owner } = wordSet

    const intl = useIntl()

    const PublishedRow = () => {
        if (props.type === "secret") {
            let elem
            if (props.wordSet.lifecycle.publishedAt) {
                elem = <FormattedMessage id="component.langka.word_set.view.published.prefix" />

            } else {
                elem = <FormattedMessage id="component.langka.word_set.view.published.not_yet" />
            }

            return <Row className="mb-2 text-wrap text-break">
                <Col>
                    <h5>{elem}</h5>
                </Col>
            </Row>
        } else {
            return <></>
        }
    }

    const CreatedAtRow = () => <Row className="mb-2 text-wrap text-break">
        <Col>
            <h5>
                <FormattedMessage id="component.langka.word_set.view.created_at.prefix" />
                {" "}
                <FormattedDate value={Date.parse(wordSet.lifecycle.createdAt)}
                    {...defaultDateTimeFormatProps}
                />
            </h5>
        </Col>
    </Row>

    const OwnerRow = () => <Row className="mb-2 text-wrap text-break">
        <Col>
            <h5>
                <FormattedMessage id="component.langka.word_set.view.owner.prefix" />
                {" "}
                {owner.publicName}
                {/*
                    TODO(teawithsand): display link to profile instead once profile pages are implemented
                    <Link to={profileInfoPath(owner.id, {
                    type: "public"
                })} >
                    {owner.publicName}
                </Link>
                */}
            </h5>
        </Col>
    </Row>

    const DescriptionRow = () => <Row className="mb-2 text-justified">
        <Col>
            {wordSet.description || intl.formatMessage({ id: "component.langka.word_set.view.no_description" })}
        </Col>
    </Row>


    const OperationsRow = () => {
        if (onWordSetEdit || onWordSetDelete || onTupleCreate) {
            return <Row className="mb-3 text-wrap text-break">
                <Col sm={12} lg={4}>
                    <ButtonGroup className="w-100">
                        {onWordSetEdit ? <Button className="w-100" onClick={() => onWordSetEdit()}>
                            <FormattedMessage id="component.langka.word_set.view.edit" defaultMessage={"Edit"} />
                        </Button> : null}
                        {onWordSetDelete ? <Button className="w-100" variant="danger" onClick={() => onWordSetDelete()}>
                            <FormattedMessage id="component.langka.word_set.view.delete" defaultMessage={"Delete"} />
                        </Button> : null}
                        {onWordSetPublish ? <Button className="w-100" variant="success" onClick={() => onWordSetPublish()}>
                            <FormattedMessage id="component.langka.word_set.view.publish" defaultMessage={"Publish"} />
                        </Button> : null}
                        {onTupleCreate ? <Button className="w-100" variant="warning" onClick={() => onTupleCreate()}>
                            <FormattedMessage id="component.langka.word_set.view.tuple_create" defaultMessage={"Add tuple"} />
                        </Button> : null}
                    </ButtonGroup>
                </Col>
            </Row>
        }

        return null
    }

    const GamesRow = () => {
        return <Row className="mb-3 text-wrap text-break">
            <Col sm={12} lg={4}>
                <ButtonGroup className="w-100">
                    <LinkContainer to={browseWordsGamePath(wordSet.id)} >
                        <Button href="#">
                            <FormattedMessage id="component.langka.word_set.view.play_browse_words" defaultMessage={"Play browse game"} />
                        </Button>
                    </LinkContainer>
                </ButtonGroup>
            </Col>
        </Row>
    }

    const LanguageRow = () => <Row className="mb-2 text-justified">
        <Col>
            <FormattedMessage id="component.langka.word_set.view.languages.prefix" defaultMessage={"languages"} />
            {" "}
            {wordSet.sourceLanguage}{" => "}{wordSet.destinationLanguage}
        </Col>
    </Row>

    return <>
        <Row className="text-wrap text-break">
            <Col>
                <h1><FormattedMessage id="component.langka.word_set.view.title.prefix" /> {props.wordSet.title}</h1>
                <hr />
            </Col>
        </Row>

        <OperationsRow />
        <GamesRow />
        <DescriptionRow />
        <LanguageRow />
        <CreatedAtRow />
        <PublishedRow />
        <OwnerRow />

        <Row className="mb-3 text-wrap text-break">
            <Col>
                <hr />
                <h3><FormattedMessage id="component.langka.word_set.word_tuples.header" /></h3>
            </Col>
        </Row>
        <Row>
            <Col>
                <WordTuplesView
                    wordTuples={wordTuples ?? []}
                    onTupleDelete={props.onTupleDelete}
                    onTupleEdit={props.onTupleEdit}
                />
            </Col>
        </Row>
    </>
}