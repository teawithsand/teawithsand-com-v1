// TODO(teawithsand): implement it

import { WordSetId } from "@app/domain/langka/definitons"
import { assertIdValid } from "@app/util/id"

export const loginPath = () => "/profile/login"
export const registerPath = () => "/profile/register"
export const initForgottenPasswordPath = () => "/profile/reset-password/init"
export const changeForgottenPasswordPath = () => "/profile/reset-password/finalize"
export const changePasswordPath = () => "/profile/change-password"
export const afterRegisterPath = () => "/profile/after-register"
export const resendRegistrationEmailPath = () => "/profile/register-resend-email"
export const aboutMePath = () => "/about-me"
export const portfolioPath = () => "/portfolio"
export const showcasePath = () => "/showcase"

export const profileInfoPath = (id: string, options: {
    type?: "public" | "secret"
}) => {
    // note: this function should be called here in order to prevent path traversal
    assertIdValid(id)

    if (!options.type || options.type === "public")
        return "/profile/show/" + id
    else
        return "/profile/show/" + id + "/details"
}
export const homePath = () => "/"

export const createWordSetPath = () => "/langka/word-set/create"
export const showWordSetPath = (id: WordSetId, options: {
    type?: "public" | "secret"
}) => {
    assertIdValid(id)

    if (!options.type || options.type === "public")
        return `/langka/word-set/show/${id}`
    else
        return `/langka/word-set/show/${id}` + "/details"
}
export const listPublicWordSetPath = () => "/langka/word-set/list/public"
export const listOwnedWordSetPath = () => "/langka/word-set/list/owned"
export const browseWordsGamePath = (id: WordSetId) => {
    assertIdValid(id)

    return `/langka/word-set/play/${id}/browse`
}