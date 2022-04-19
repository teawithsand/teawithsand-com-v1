export const assertIdValid = (id: string) => {
    if (!/[a-zA-Z0-9]/.test(id))
        throw new Error(`Id: ${id} is not valid`)
}