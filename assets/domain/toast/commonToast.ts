import { IntlShape } from "react-intl";
import { makeSimpleToastWithAction } from "./toast";

export const defaultToastTimeout = 1000 * 60

export const loggedOutToast = (intl: IntlShape) => makeSimpleToastWithAction({
    title: intl.formatMessage({ id: "component.toast.logout.title" }),
    message: intl.formatMessage({ id: "component.toast.logout.message" }),
    timeout: defaultToastTimeout,
})
/*

export const testToast = (msg: string, timeout?: number) => makeSimpleToastWithAction({
    title: "Test toast " + Math.round(Math.random() * 10000),
    message: msg,
    timeout: defaultToastTimeout,
})
*/
export const changedPasswordToast = (intl: IntlShape) => makeSimpleToastWithAction({
    title: intl.formatMessage({ id: "component.toast.changed_password.title" }),
    message: intl.formatMessage({ id: "component.toast.changed_password.message" }),
    timeout: defaultToastTimeout,
})

export const resettedPasswordToast = (intl: IntlShape) => makeSimpleToastWithAction({
    title: intl.formatMessage({ id: "component.toast.reset_password.finalized.title" }),
    message: intl.formatMessage({ id: "component.toast.reset_password.finalized.message" }),
    timeout: defaultToastTimeout,
})

export const confirmedRegistrationToast = (intl: IntlShape) => makeSimpleToastWithAction({
    title: intl.formatMessage({ id: "component.toast.confirm_registration_finalized.title" }),
    message: intl.formatMessage({ id: "component.toast.confirm_registration_finalized.message" }),
    timeout: defaultToastTimeout,
})