export const generateRandomWord = () => {
    const alpha = "abcdefghijklmnopqrstuvwxyz".split("")
    const length = 4 + Math.round(Math.random() * (5 + 1))
    let r = ""
    for (let i = 0; i < length; i++) {
        r += alpha[Math.round((Math.random() * 1000)) % alpha.length]
    }
    return r
}