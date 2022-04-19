import {
    HtmlHTMLAttributes,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from 'react'
import * as React from "react"
import classnames from '@app/util/classnames'

const CancelButton = (
    props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
): JSX.Element => {
    return (
        <svg width='24' height='24' viewBox='0 0 24 24' {...props}>
            <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z' />
        </svg>
    )
}

export type TagsValue = {
    values: string[]
    name?: string
}

interface InputTagsProps {
    placeholder?: string
    onTags: (value: TagsValue) => void
    values: string[]
    name?: string
    elementClassName?: string
}

const Tags = (props: (InputTagsProps & HtmlHTMLAttributes<HTMLInputElement>)) => {
    const {
        values,
        placeholder,
        onTags,
        name,
        elementClassName,
        className
    } = props
    const [terms, setTerms] = useState<string[]>(values)
    const [value, setValue] = useState('')
    const [focusIndex, setFocusIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)


    const forceInputFocus = () => {
        if (inputRef.current && focusIndex === -1) {
            inputRef.current.focus()
        }
    }

    useLayoutEffect(() => {
        if (terms.length === 0) {
            setFocusIndex(-1)
        }
        onTags({ values: terms, name: name })
    }, [terms.length]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setTerms(values)
    }, [values])

    useEffect(() => {
        forceInputFocus()
    }, [focusIndex]) // eslint-disable-line react-hooks/exhaustive-deps

    const onchange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.value)
    }

    const onkeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { key } = event
        const currentValue = value.trim()
        const isEndOfText = event.currentTarget.selectionEnd === currentValue.length
        const isPossibleRight =
            (isEndOfText || currentValue.length === 0) && terms.length > 0
        if ((key === 'Enter' || key === ' ') && currentValue != '') {
            event.preventDefault()
            setTerms([...terms, currentValue])
            setValue('')
            setFocusIndex(-1)
        } else if (
            (key === 'Backspace' || key === 'ArrowLeft') &&
            isPossibleRight
        ) {
            event.preventDefault()
            setFocusIndex(terms.length - 1)
        } else if (key === 'ArrowRight' && isPossibleRight) {
            event.preventDefault()
            setFocusIndex(0)
        }
    }

    const handleRemove = (index: number, focus: boolean) => {
        setTerms(terms.filter((_, i) => i !== index))
        if (focus) {
            setFocusIndex(Math.max(focusIndex - 1, 0))
        } else {
            forceInputFocus()
        }
    }

    const setSelectedIndex = (index: number) => {
        if (index < terms.length && index > -1) {
            setFocusIndex(index)
        } else {
            setFocusIndex(-1)
        }
    }

    return (
        <div className='form-control d-inline-flex flex-wrap'>
            {terms.map((item, index) => {
                const focus = focusIndex === index
                return (
                    <Element
                        key={`${item}${index}`}
                        value={item}
                        index={index}
                        onRemove={handleRemove}
                        focus={focus}
                        onSelectedIndex={setSelectedIndex}
                        className={elementClassName}
                    />
                )
            })}
            <input
                data-testid='input-tags'
                ref={inputRef}
                type='text'
                className={classnames(
                    'border-0 w-auto flex-fill input-tags',
                    className
                )}
                placeholder={placeholder}
                aria-label={placeholder}
                value={value}
                onChange={onchange}
                onKeyUp={onkeyup}
                autoFocus
                name={name}
            />
        </div>
    )
}


interface ElementProps {
    value: string
    index: number
    onRemove: (index: number, focus: boolean) => void
    onSelectedIndex: (index: number) => void
    focus: boolean
    className?: string
}

const Element = (props: ElementProps): JSX.Element => {
    const [focus, setFocus] = useState(false)
    const onclick = () => {
        props.onRemove(props.index, focus)
    }
    const ref = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        if (ref.current && props.focus) {
            ref.current.focus()
        }
    }, [props.focus])

    const onkeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { key } = event
        event.preventDefault()
        if (key === 'Backspace' || key === 'Delete') {
            props.onRemove(props.index, props.focus)
        } else if (key === 'ArrowLeft') {
            props.onSelectedIndex(props.index - 1)
        } else if (key === 'ArrowRight') {
            props.onSelectedIndex(props.index + 1)
        }
    }
    return (
        <div
            data-testid='tag-element'
            ref={ref}
            tabIndex={0}
            className={classnames(
                'badge bg-secondary bg-gradient mr-1 my-auto py-auto pr-0 ',
                props.className
            )}
            onKeyUp={onkeydown}
            onFocus={() => {
                setFocus(true)
            }}
            onBlur={() => {
                setFocus(false)
            }}
        >
            {props.value}
            <button
                tabIndex={-1}
                className='border-0 bg-transparent ml-3 mr-1 my-auto py-auto px-0'
                style={{ outline: 0 }}
                onClick={onclick}
            >
                <CancelButton
                    style={{ fill: 'var(--bs-white)', opacity: 1 }}
                    width={18}
                    height={18}
                />
            </button>
        </div>
    )
}

export default Tags