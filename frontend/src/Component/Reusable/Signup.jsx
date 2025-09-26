import { CircularProgress } from '@mui/material'
import '../../CSS/Reusable/Signup.css'
import { useContext, useEffect, useState } from 'react'
import { ContextData } from '../../main.jsx'
import { authAxios } from '../../config/axiosconfig.js'
import google from "../../Images/google.png"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import Login2FA from '../TwoFA/Login2FA.jsx'
import Recovery2FAOtp from '../TwoFA/Recovery2FAOtp.jsx'
import ResetQRCode from '../TwoFA/ResetQRCode.jsx'

const Signup = ({ setIsSignUp, setIsLogin }) => {
    const [loader, setLoader] = useState(false);

    const { notify, setUser, setShareableUsers, setRecieveableUsers, setSentDocs, setReceivedDocs } = useContext(ContextData)

    const [signUp, setSignUp] = useState({ name: "", email: "", password: "" })

    const [message, setMessage] = useState({ name: "", email: "", password: "" })

    const [googleLoader, setGoogleLoader] = useState(false);

    const [showLogin2FA, setShowLogin2FA] = useState(false)

    const [showRecovery2FA, setShowRecovery2FA] = useState(false);

    const [QRCodeObj, setQRCodeObj] = useState(null);

    const [tempUser, setTempUser] = useState(null);

    const setUserAfterLogin = (res) => {
        if (res.data.user.is2FA) { // is2fA = true
            setTempUser(res.data.user);
            setShowLogin2FA(true);
            return;
        }

        setUser(res.data.user);

        if (res?.data?.send || res?.data?.send?.length !== 0) {
            setShareableUsers(res.data.send);
        }

        if (res?.data?.recieved || res?.data?.recieved?.length !== 0) {
            setRecieveableUsers(res.data.recieved);
        }

        if (res?.data?.sendResult || res?.data?.sendResult?.length !== 0) {
            setSentDocs(res.data.sendResult);
        }

        if (res?.data?.recievedResult || res?.data?.recievedResult?.length !== 0) {
            setReceivedDocs(res?.data?.recievedResult)
        }
    }

    const handleRegister = async () => {
        try {
            setLoader(true)
            await authAxios.post('/register', { name: signUp.name, email: signUp.email, password: signUp.password })

            setMessage({ name: "", email: "", password: "" })
            notify("success", "User Registered SuccessFully")
            setLoader(false)
            setIsSignUp(false)
            setIsLogin(true)
        } catch (error) {
            setLoader(false)
            if (error.response.data.type === "zod") {
                setMessage({ name: "", email: "", password: "" })
                error.response.data.message.forEach((err) => {
                    setMessage(prev => {
                        if (err.toLowerCase().includes("name")) {
                            return { ...prev, name: err };
                        } else if (err.toLowerCase().includes("email")) {
                            return { ...prev, email: err };
                        } else {
                            return { ...prev, password: err };
                        }
                    });
                })
            } else {
                setMessage({ name: "", email: "", password: "" })
                notify("error", error.response.data.message);
            }
        }
    }

    useEffect(() => {
        document.documentElement.style.overflow = "hidden"

        return () => document.documentElement.style.overflow = "auto"
    }, [])

    return <>
        {!showLogin2FA && <div className="signup-con">
            <div className="popup">
                <div className="signup-header">
                    <i className="ri-close-line" onClick={() => {
                        if (!loader && !googleLoader) { setIsSignUp(false); }
                    }}></i>
                    <h2>SignUp</h2>
                </div>
                <form className="body" onSubmit={(e) => { e.preventDefault(); if (!loader && !googleLoader) { handleRegister() } }}>
                    <div className="name common">
                        <div>
                            <input type="text" name="name" value={signUp.name} placeholder="Enter name" onChange={(e) => { setSignUp({ ...signUp, [e.target.name]: e.target.value }) }} />
                            <i className="ri-user-line"></i>
                        </div>
                        {message.name && <div>* {message.name}</div>}
                    </div>
                    <div className="username common">
                        <div>
                            <input type="text" placeholder="Enter email" name="email" value={signUp.email} onChange={(e) => { setSignUp({ ...signUp, [e.target.name]: e.target.value }) }} />
                            <i className="ri-mail-line"></i>
                        </div>
                        {message.email && <div>* {message.email}</div>}
                    </div>
                    <div className="password common">
                        <div>
                            <input type="password" placeholder='Enter password' name="password" value={signUp.password} onChange={(e) => { setSignUp({ ...signUp, [e.target.name]: e.target.value }) }} />
                            <i className="ri-lock-2-line"></i>
                        </div>
                        {message.password && <div>* {message.password}</div>}
                    </div>
                    {loader ? <button type="button" ><CircularProgress size={18} className='circularprogress' /></button> :
                        <button type="submit">Signup</button>}
                </form>
                <div className="login">
                    Have an account? <span onClick={() => { if (!loader && !googleLoader) { setIsSignUp(false); setIsLogin(true) } }}>Login</span>
                </div>

                {/* Social Login */}

                <div className="or">
                    <span></span>
                    <span>OR</span>
                    <span></span>
                </div>
                {!googleLoader ?
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    setGoogleLoader(true);

                                    const res = await authAxios.post('/google_login', { token: credentialResponse.credential });

                                    setUserAfterLogin(res);
                                    if (!res.data.user.is2FA) {
                                        notify("success", "User logged in successfully")
                                    }
                                    setGoogleLoader(false)
                                } catch (error) {
                                    setGoogleLoader(false)
                                    notify("error", error?.response?.data?.message || error?.message || "Google login failed")
                                }
                            }}
                            onError={() => {
                                notify("error", "Google login failed")
                            }}
                        />
                    </GoogleOAuthProvider>
                    : <div className="google">
                        <CircularProgress size={21} className='circularprogress' />
                    </div>}
            </div>
        </div>}

        {(showLogin2FA && !showRecovery2FA) && <Login2FA tempUser={tempUser} setTempUser={setTempUser} setIsLogin={setIsLogin} setShowRecovery2FA={setShowRecovery2FA} />}

        {(showRecovery2FA && !QRCodeObj) && <Recovery2FAOtp setQRCodeObj={setQRCodeObj} tempUser={tempUser} setIsLogin={setIsLogin} />}

        {QRCodeObj && <ResetQRCode QRCodeObj={QRCodeObj} setQRCodeObj={setQRCodeObj} tempUser={tempUser} setIsLogin={setIsLogin} />}
    </>
}

export default Signup