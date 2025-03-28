import { useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";
import { whoami } from "./api/whoami";

export enum AuthState {
    user = "user",
    admin = "admin",
    unauthenticated = "unauthenticated",
}

type AuthCheckerType = {
    children: React.ReactNode;
    authState: AuthState[];
    redirectTo: string;
};

export default function AuthChecker({
    children,
    authState,
    redirectTo,
}: AuthCheckerType) {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;

    if (me === undefined) {
        return null;
    }

    if (
        (me === null && authState.includes(AuthState.unauthenticated)) ||
        (me && authState.includes(me.role))
    ) {
        return children;
    }

    return <Navigate to={redirectTo} replace />;
}
