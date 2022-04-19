import { State } from "./defines"

export type Theme = "light" | "dark"

export type SetThemeAction = {
    type: "TWSAPI/theme/set-theme",
    theme: Theme
}
export function setThemeAction(theme: Theme): SetThemeAction {
    return {
        type: "TWSAPI/theme/set-theme",
        theme,
    }
}

export const themeSelector = (state: State) => state.theme