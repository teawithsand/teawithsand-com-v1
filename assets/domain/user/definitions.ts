export type ProfileId = string & { readonly symbol: unique symbol }

export interface ProfileReferenceSummary {
    id: ProfileId,
    publicName: string,
}