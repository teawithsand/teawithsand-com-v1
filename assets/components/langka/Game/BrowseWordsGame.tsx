import { WordTupleSummary } from "@app/domain/langka/definitons"
import GameWrapper from "@app/util/game/GameWrapper"
import { FormattedMessage, IntlShape, useIntl } from "react-intl"
import React from "react"
import { browseWordsGameFactory, BrowseWordsGameInput, BrowseWordsGameState } from "@app/domain/langka/game/browseWordsGame"
import { Button, ButtonGroup, Col, Row } from "react-bootstrap"
import { GameRenderer } from "@app/util/game/GameRenderer"
import ResponsiveColumn from "@app/components/helper/ResponsiveColumn"
import { parseWordTupleDestinationWords } from "@app/domain/langka/wordtuple"
import { BREAKPOINTS, BREAKPOINT_SM, useBreakpoint, useBreakpointIndex } from "@app/util/breakpointHook"


export interface BrowseWordsGameRendererConfig { }

export interface BrowseWordsGameRendererOptions {
    intl: IntlShape,
    config: BrowseWordsGameRendererConfig,
}


export const browseWordsGameRendererFactory =
    (options: BrowseWordsGameRendererOptions): GameRenderer<BrowseWordsGameState, BrowseWordsGameInput> => ({ state, handleInput }) => {
        const tuple = state.tuples[state.tupleIndex]

        const breakpoint = useBreakpointIndex()

        const handleClick = () => {
            if (state.showTuple) {
                handleInput({
                    type: "next-word",
                })
            } else {
                handleInput({
                    type: "show",
                })
            }
        }

        let descriptionRow = null
        if (state.showTuple) {
            descriptionRow = <Row className="langka-browse-game--description-row">
                <Col>
                    {tuple.description}
                </Col>
            </Row>
        } else {
            descriptionRow = <Row className="langka-browse-game--description-row text-wrap text-break">
                <Col>
                    <FormattedMessage id="component.langka.game.browse_words.description_hidden" />
                </Col>
            </Row>
        }

        const referrerHack: any = {
            referrerPolicy: "no-referrer"
        }

        let linksRows = null
        linksRows = <>
            <Row className="text-center">
                <ResponsiveColumn>
                    <FormattedMessage id="component.langka.game.browse_words.useful_links" />
                </ResponsiveColumn>
            </Row>
            <Row>
                <ResponsiveColumn>
                    <ButtonGroup className="w-100">
                        <Button disabled={!state.showTuple} variant="success" href={`https://www.google.com?q=${encodeURIComponent(
                            '"' + tuple.sourceWord + '"'
                        )}`} target="_blank" {...referrerHack}>
                            <FormattedMessage id="component.langka.game.browse_words.useful_links.google" defaultMessage={"Google"} />
                        </Button>
                    </ButtonGroup>
                </ResponsiveColumn>
            </Row>
        </>

        let topColumnDisplay = null
        if (breakpoint <= BREAKPOINTS.indexOf(BREAKPOINT_SM)) {
            topColumnDisplay = <>
                <Row className="mb-3 border-bottom border-secondary border-1 ms-1 me-1 align-middle langka-browse-game--top-words-row" onClick={handleClick}>
                    <Col >
                        <h3>{tuple.sourceWord}</h3>
                    </Col>
                </Row>
                <Row onClick={handleClick} className="mb-3 align-middle langka-browse-game--bottom-words-row">
                    <Col>
                        <h3>{state.showTuple ? parseWordTupleDestinationWords(tuple.destinationWords).join(", ") : "???"}</h3>
                    </Col>
                </Row>
                {descriptionRow}
            </>
        } else {
            topColumnDisplay = <>
                <Row className="mb-3 langka-browse-game--common-words-row">
                    <Col className="border-end border-secondary d-flex">
                        <div className="align-self-center w-100">
                            <h3>{tuple.sourceWord}</h3>
                        </div>
                    </Col>
                    <Col className="d-flex">
                        <div className="align-self-center w-100">
                            <h3>{state.showTuple ? parseWordTupleDestinationWords(tuple.destinationWords).join(", ") : "???"}</h3>
                        </div>
                    </Col>
                </Row>
                {descriptionRow}
            </>
        }
        let button = null

        if (state.showTuple) {
            button = <Button
                size={"lg"}
                className="w-100"
                onClick={handleClick}>
                <FormattedMessage id="component.langka.game.browse_words.next_word" defaultMessage={"Next word"} />
            </Button>
        } else {
            button = <Button
                size={"lg"}
                className="w-100"
                onClick={handleClick}>
                <FormattedMessage id="component.langka.game.browse_words.show_word" defaultMessage={"Show"} />
            </Button>
        }

        return <>
            <Row className="mb-4 text-center">
                <Col>
                    <FormattedMessage id="component.langka.game.browse_words.iteration_prefix" values={{
                        iteration: state.iteration + 1,
                    }} defaultMessage={"Iteration #{iteration}"} />
                    <br />
                    <FormattedMessage id="component.langka.game.browse_words.tuple_index" values={{
                        iteration: state.tupleIndex + 1,
                        tupleCount: state.tuples.length,
                    }} defaultMessage={"Word {iteration} out of {tupleCount}"} />
                    <br />
                    <FormattedMessage id="component.langka.game.browse_words.tuple_iteration_prefix" values={{
                        iteration: state.tupleIteration + 1,
                    }} defaultMessage={"Word set repetition #{iteration}"} />

                    <hr />
                </Col>
            </Row>
            <Row className="text-center mb-4">
                <Col>
                    {topColumnDisplay}
                </Col>
            </Row>
            <Row className="text-center mb-3">
                <ResponsiveColumn>
                    {button}
                </ResponsiveColumn>
            </Row>
            {linksRows}
        </>
    }


export default (props: {
    tuples: WordTupleSummary[],
    config: BrowseWordsGameRendererConfig,
}) => {
    const { tuples, config } = props

    const intl = useIntl()
    const renderer = browseWordsGameRendererFactory({ intl, config })

    return <>
        <Row>
            <Col>
                <GameWrapper
                    gameFactory={() => browseWordsGameFactory({
                        sortMode: "shuffle",
                        tuples
                    })}
                    renderer={renderer}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                {/* TODO(teawithsand): exit game button here */}
            </Col>
        </Row>
    </>
}