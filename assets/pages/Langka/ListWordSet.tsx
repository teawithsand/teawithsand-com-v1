import { userDataSelector } from "@app/actions/userAction"
import AlertBar from "@app/components/helper/AlertBar"
import LoginRequiredBar from "@app/components/helper/LoginRequiredBar"
import ResponsiveColumn from "@app/components/helper/ResponsiveColumn"
import WordSetList from "@app/components/langka/WordSet/WordSetList"
import { WordSetListFilterFormData, wordSetListFilterFormRendererFactory, wordSetListFilterFormValidatorFactory } from "@app/components/langka/WordSet/WordSetListFilterForm"
import LoadingSpinner from "@app/components/LoadingSpinner"
import { makeWordSetClient, WordSetsSearchData } from "@app/domain/langka/api/wordset"
import { ExplainedError, useErrorExplainer } from "@app/util/explainError"
import SimpleFormWrapper from "@app/util/formka/SimpleFormWrapper"
import { useApiClient } from "@app/util/httpClient"
import { mapMapSortedKeys } from "@app/util/lang"
import { useParametrizedLoadHelper } from "@app/util/react/parametrizedLoadHelper"
import React, { useEffect, useRef, useState } from "react"
import { Button, Col, Collapse, Container, Row } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { showWordSetPath } from "../urls"

// TODO(teawithsand): implement page navigation
export default (props: {
    type: "public" | "owned",
}) => {
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [isAfterLastPage, setIsAfterLastPage] = useState(false)
    const [searchData, setSearchData] = useState<WordSetsSearchData>({})
    const [searchFormData, setSearchFormData] = useState<WordSetListFilterFormData>({
        title: "",
        owner: "",
        sort: "title_asc",
    })
    const [isShowSearch, setIsShowSearch] = useState(false)
    const userData = useSelector(userDataSelector)
    const explainer = useErrorExplainer()
    const intl = useIntl()

    const searchDataHack = useRef<WordSetsSearchData>()
    searchDataHack.current = searchData

    const { type } = props

    const [pageData, setLoadedData, loadPage] = useParametrizedLoadHelper({
        aggregator: (loaded) => mapMapSortedKeys(loaded, {}, (v) => v)
            .flatMap((v) => v),
        loader: async (data: {
            type: string,
            page: number
        } | null) => {
            if (data) {
                const { type, page } = data
                if (type === "public") {
                    return await wordSetClient.getWordSetsSummary(page, searchDataHack.current)
                } else /*if (props.type === "owned"); for now the only case*/ {
                    return await wordSetClient.getOwnWordSetsSummary(page, searchDataHack.current)
                }
            }
            return []
        },
        onNewValueLoaded: (_, value) => {
            // empty load == last page
            if (value.length === 0) {
                setIsAfterLastPage(true)
            }
        }
    })

    const client = useApiClient()
    const wordSetClient = makeWordSetClient(client)

    useEffect(() => {
        setPage(0)
        setLoadedData(new Map)
        loadPage({
            page: 0,
            type,
        })
    }, [type])

    if (props.type === "owned" && userData === null) {
        return <Container>
            <LoginRequiredBar />
        </Container>
    }

    let explainedError: ExplainedError | null = null

    if (pageData.hasError) {
        explainedError = explainer.explainError(pageData.error)
    }


    const onLoadMoreClick = () => {
        setPage(page + 1)
        loadPage({
            page: page + 1,
            type,
        })
    }

    const onNewSearchData = (data: WordSetListFilterFormData) => {
        searchDataHack.current = {

        }
        if (data.title) {
            searchDataHack.current["title"] = data.title
        }
        if (data.owner) {
            searchDataHack.current["owner.publicName"] = data.owner
        }
        if (data.sort === "title_asc") {
            searchDataHack.current["order[title]"] = "asc"
        } else if (data.sort === "title_desc") {
            searchDataHack.current["order[title]"] = "desc"
        } else if (data.sort === "created_at_asc") {
            searchDataHack.current["order[lifecycle.createdAt]"] = "asc"
        } else if (data.sort === "created_at_desc") {
            searchDataHack.current["order[lifecycle.createdAt]"] = "desc"
        }
        setSearchData(searchDataHack.current)
        setIsAfterLastPage(false)
        setLoadedData(new Map)
        loadPage({
            page,
            type,
        })
        setSearchFormData(data)
    }

    const BottomBarOrButton = () => {
        if (pageData.state !== "ready")
            return <LoadingSpinner />

        if (isAfterLastPage) {
            return <FormattedMessage id="page.langka.list_word_set.no_more" />
        } else {
            return <Button onClick={onLoadMoreClick}>
                <FormattedMessage id="page.langka.list_word_set.load_more" />
            </Button>
        }
    }

    return <Container>
        <Row className="mb-3 text-center">
            <Col>
                <h1>
                    {type === "owned" ? <FormattedMessage id="page.langka.list_word_set.title.owned" /> : <FormattedMessage id="page.langka.list_word_set.title.public" />}
                </h1>
            </Col>
        </Row>
        <Row className="mb-3 text-center">
            <Col>
                <Button onClick={() => setIsShowSearch(!isShowSearch)}>
                    <FormattedMessage id="page.langka.list_word_set.filter.toggle_collapse" />
                </Button>
            </Col>
        </Row>
        <Row className="mb-3">
            <Collapse in={isShowSearch}>
                <div>
                    <ResponsiveColumn>
                        <SimpleFormWrapper
                            formData={searchFormData}
                            onChanged={(data) => setSearchFormData(data)}
                            render={wordSetListFilterFormRendererFactory({
                                topErrorTitle: intl.formatMessage({ id: "page.langka.list_word_set.search_form.top_error_title" }),
                                intl,
                            })}
                            localValidator={wordSetListFilterFormValidatorFactory({ intl })}
                            onSubmit={(data) => onNewSearchData(data)}
                        />
                        <Button variant="danger" className="w-100 mt-2" onClick={() => {
                            onNewSearchData({
                                title: "",
                                owner: "",
                                sort: "title_asc",
                            })
                            setIsShowSearch(false)
                        }}>
                            <FormattedMessage id="page.langka.list_word_set.search_form.reset" />
                        </Button>
                    </ResponsiveColumn>
                </div>
            </Collapse>
        </Row>
        <Row className="mb-3">
            <Col>
                {
                    pageData.state === "ready" && pageData.hasError && explainedError ?
                        <AlertBar
                            variant="danger"
                            message={explainedError.message}
                        />
                        : null
                }
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                {
                    pageData.state === "ready" || pageData.aggregated.length > 0 ? <WordSetList
                        // HACK(teawithsand): TS does not know that our props.type matches entries type, so any cast is here
                        data={pageData.aggregated as any}
                        type={props.type === "owned" ? "public" : "secret"}
                        onShowClick={(data) => {
                            navigate(showWordSetPath(data.id, {
                                type: props.type === "owned" ? "secret" : "public"
                            }))
                            // TODO(teawithsand): navigate here
                        }}
                    />
                        : null
                }
            </Col>
        </Row>
        <Row>
            <Col className="text-center">
                <BottomBarOrButton />
            </Col>
        </Row>
    </Container>
}