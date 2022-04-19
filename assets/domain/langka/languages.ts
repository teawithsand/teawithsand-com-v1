import langauges from "../../data/languages.json"

const langs = langauges
export { langs as LANGUAGES }

export const isLangauge2CodeValid = (language: string): boolean => langauges.some(e => e.twoLetterCode === language)