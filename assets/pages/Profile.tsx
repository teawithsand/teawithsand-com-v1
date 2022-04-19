import * as React from "react"
import { PublicProfileInfo } from "@app/domain/user/profile"
import { FormattedMessage } from "react-intl"
import { Container } from "react-bootstrap"

export type ProfileProps = {
    uid: string,
    type: "public" | "secret",
}

export default (props: ProfileProps) => {
    return <Container>
        <PublicProfile profile={{
            publicName: "userone"
        }} />
    </Container>
}

export const PublicProfile = (props: {
    profile: PublicProfileInfo,
}) => {
    const { profile } = props
    return <div>
        <h1>
            <FormattedMessage
                id="page.profile.public_name"
                values={{
                    publicName: profile.publicName,
                }} 
            />
        </h1>
    </div>
}