import google from "../../Images/google.png"
import { useGoogleLogin } from "@react-oauth/google"
import { authAxios } from "../../config/axiosconfig"

const GoogleButton = () => {
    const handleGoogleLogin = useGoogleLogin({
        flow : "implicit",
        onSuccess: async (credentialResponse) => {
            console.log("credentialResponse: ", credentialResponse);
             const res = await authAxios.post('/google_login', { token: credentialResponse.access_token });
        },
        onError: () => {
            notify("error", "Google login failed")
        }
    })

    return <div className="google" onClick={() => { handleGoogleLogin() }}>
        <img src={google} alt="google" />
        Continue with google
    </div>
}

export default GoogleButton