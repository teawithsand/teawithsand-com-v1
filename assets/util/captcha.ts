let publicToken = ""
export const initializeRecaptchaToken = () => {
    publicToken = (document.getElementById("recaptcha-public-token") as any).value
    if (!publicToken || typeof publicToken !== "string")
        throw new Error("Unable to load recaptcha v2 public token")
}

export const getRecaptchaV2PublicToken = () => publicToken