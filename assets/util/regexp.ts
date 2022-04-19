/**
 * @deprecated Apparently does not work as intended and better solution to this problem is using includes/indexOf methods of string
 */
export const makeContainsRegex = (text: string, ignoreCase: boolean = false) => {
    let res = ""
    for (const c of text) {
        res += "\\" + c
    }
    if (ignoreCase) {
        return new RegExp(res, "i")
    } else {
        return new RegExp(res)
    }
}