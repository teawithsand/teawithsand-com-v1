export const sha256 = async (input: string): Promise<Buffer> => {
    const res = await crypto.subtle.digest('SHA-256', Buffer.from(input, "utf-8"))
    return Buffer.from(res)
}