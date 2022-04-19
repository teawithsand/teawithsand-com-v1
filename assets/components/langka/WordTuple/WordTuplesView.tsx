import * as React from "react"
import { FormattedMessage, useIntl } from "react-intl";
import { Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { parseWordTupleDestinationWords } from "@app/domain/langka/wordtuple";
import { WordTupleSummary } from "@app/domain/langka/definitons";
import { WordTuplesBag } from "@app/domain/langka/wordset";
import { debounce } from "@app/util/limiting";

export default (props: {
    wordTuples: WordTupleSummary[],

    onTupleEdit?: (tuple: WordTupleSummary) => void,
    onTupleDelete?: (tuple: WordTupleSummary) => void,
}) => {
    const intl = useIntl()
    const [debouncedFilterValue, setDebouncedFilterValue] = React.useState("")
    const [actualFitlerValue, setActualFilterValue] = React.useState("")

    const editable = !!props.onTupleEdit
    const deletable = !!props.onTupleDelete

    // TODO(teawithsand): on small screens and when many actions show dropdown + icon
    const makeButtonBar = (tuple: WordTupleSummary) => {
        if (!editable && !deletable) {
            return null;
        }

        return <ButtonGroup>
            {editable ? <Button className="w-100" size="sm" variant="primary" onClick={() => onTupleEdit(tuple)}>
                <FormattedMessage id="component.langka.word_set_view.table_entry.edit" defaultMessage={"edit"} />
            </Button> : null}
            {deletable ? <Button className="w-100" size="sm" variant="danger" onClick={() => onTupleDelete(tuple)}>
                <FormattedMessage id="component.langka.word_set_view.table_entry.delete" defaultMessage={"delete"} />
            </Button> : null}
        </ButtonGroup>
    }


    // Note: playing with these memos is required, since otherwise 
    //  my pc browser when having 500 tuples 3 words each causes serious framerate drops(below 1 fps)
    // debouncing + these memos keep this component alive

    const renderedCardList = React.useMemo(
        () => {
            return new WordTuplesBag(props.wordTuples)
                .sortedTuples
                .map(v => {
                    return {
                        ...v,
                        destiationWords: parseWordTupleDestinationWords(v.destinationWords),
                        tuple: v,
                    }
                })
        },
        [props.wordTuples]
    )
    const tupleList = React.useMemo(
        () => {
            return renderedCardList.filter(
                (v) => {
                    return !debouncedFilterValue ||
                        v.sourceWord.includes(debouncedFilterValue) ||
                        v.destiationWords.some(d => d.includes(debouncedFilterValue))
                }
            )
        },
        [renderedCardList, debouncedFilterValue]
    )


    /*
    () => tupleList.map((v, i) => <tr key={v.sourceWord}>
        <td>{i + 1}</td>
        <td>{v.sourceWord}</td>
        <td>
            {v.destiationWords.join(", ")}
        </td>
        {editable || deletable ? <td>{makeButtonBar(v.tuple)}</td> : null}
    </tr>
    */

    const renderedTupleList = React.useMemo(
        () =>
            tupleList.map((v, i) => {
                return <Card className="mb-3" key={i}>
                    <Card.Body>
                        <Card.Title>
                            #{i + 1}{" "}{v.sourceWord}
                        </Card.Title>
                        <Row className="mb-2">
                            <Col>
                                {v.destiationWords.join(", ")}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                {v.description || <FormattedMessage id="component.langka.word_tuples_view.no_description" />}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {makeButtonBar(v.tuple)}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            }),
        [tupleList, editable, deletable]
    )

    const onFitlerChangeOne = React.useMemo(
        () => debounce(
            (e: string) => {
                setDebouncedFilterValue(e)
            },
            100
        )[0],
        []
    )
    const onFilterChangeTwo = (e: string) => setActualFilterValue(e)

    const onFilterChange = (e: string) => {
        onFitlerChangeOne(e)
        onFilterChangeTwo(e)
    }

    const onTupleEdit = (tuple: WordTupleSummary) => {
        if (props.onTupleEdit)
            props.onTupleEdit(tuple)
    }

    const onTupleDelete = (tuple: WordTupleSummary) => {
        if (props.onTupleDelete)
            props.onTupleDelete(tuple)
    }


    if (renderedCardList.length === 0)
        return <Row>
            <Col className="text-center">
                <FormattedMessage id="component.langka.word_set_view.empty" />
            </Col>
        </Row>


    return <>
        <Row className="mb-3">
            <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group controlId="formBasicEmail">
                    {/*
                    <Form.Label>
                        <FormattedMessage id="component.langka.word_bag_view.search.label" />
                    </Form.Label>
                    */}
                    <InputGroup>
                        {debouncedFilterValue.length === 0 ?
                            <InputGroup.Text>
                                <FormattedMessage id="component.langka.word_bag_view.search.on_no_input" defaultMessage="Filter" />
                            </InputGroup.Text>
                            :
                            <Button variant="danger" onClick={() => onFilterChange("")}>
                                <FormattedMessage id="component.langka.word_bag_view.search.on_input_text" defaultMessage="Reset" />
                            </Button>
                        }
                        <Form.Control
                            type="text"
                            placeholder={intl.formatMessage({ id: "component.langka.word_bag_view.search.placeholder" })}
                            value={actualFitlerValue}
                            onChange={(e) => onFilterChange(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>
            </Form>
        </Row>
        <Row>
            <Col xs={12} lg={9} className="ms-auto me-auto">
                {renderedTupleList}
            </Col>
        </Row>
        <Row>
            <Col className="text-center">
                <FormattedMessage id="component.langka.word_set_view.bottom_summary" values={{
                    size: tupleList.length,
                }} />
            </Col>
        </Row>
    </>
}