import transaltionsEn from "./translations_en.json"

export const i18nConfig = {
    locale: 'en',
    messages: {
        ...transaltionsEn,
        "common.footer": "Made by teawithsand 2022 - echo date(\"Y\");",
        "home.title": "Teawithsand's webpage",
        "home.subtitle": "Integrates previously made projects in single one",
    }
}