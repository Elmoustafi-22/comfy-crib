import { signOut } from "../../client/src/redux/userSlice";

export const fetchWithAuth = async (url, options = {} , dispatch, navigate) => {
    try{
        const response = await fetch (url, {
            ...options,
            credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
            dispatch(signOut());
            navigate("/sign-in");
            return null;
        }
        return response;
    } catch(error) {
        console.error('Fetch error', error)
        throw error;
    }
}