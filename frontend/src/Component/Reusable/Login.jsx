import { CircularProgress } from '@mui/material'
import '../../CSS/Reusable/Login.css'
import { useContext, useEffect, useState } from 'react'
import { ContextData } from '../../main'
import { authAxios } from '../../config/axiosconfig'
import Login2FA from '../TwoFA/Login2FA'
import Recovery2FAOtp from '../TwoFA/Recovery2FAOtp'
import ResetQRCode from '../TwoFA/ResetQRCode'
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import { startAuthentication } from '@simplewebauthn/browser';


const Login = ({ setIsLogin, setIsForgot, setIsSignUp }) => {
    const { notify, setUser, setShareableUsers, setRecieveableUsers, setSentDocs, setReceivedDocs } = useContext(ContextData)

    const [login, setLogin] = useState({ email: "", password: "" })

    const [message, setMessage] = useState({ email: "", password: "" })

    const [loader, setLoader] = useState(false)

    const [biometricLoader, setBiometricLoader] = useState(false)

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

    const handleLogin = async () => {
        try {
            setLoader(true)

            const res = await authAxios.post('/login', { email: login.email, password: login.password });

            if (res.data.success) {
                setUserAfterLogin(res);

                if (!res.data.user.is2FA) {
                    setLoader(false)
                    notify("success", "User logged in successfully")
                }
            }
        } catch (error) {
            setLoader(false)
            setMessage({ email: "", password: "" })
            if (error?.response?.data?.type === "zod") {
                error.response.data.message.forEach((err) => {
                    setMessage((prev) => {
                        if (err.toLowerCase().includes("email")) {
                            return { ...prev, email: err };
                        } else {
                            return { ...prev, password: err };
                        }
                    })
                })
            } else if (error?.response?.data?.message.includes("password")) {
                setMessage(prev => { return { ...prev, password: error?.response?.data?.message } })
            } else {
                notify("error", error?.response?.data?.message)
            }
        }
    }

    const [googleLoader, setGoogleLoader] = useState(false);

    useEffect(() => {
        document.documentElement.style.overflow = "hidden"

        return () => document.documentElement.style.overflow = "auto"
    }, [])

    const loginByBiometric = async () => {
        try {
            setBiometricLoader(true)
            const passKey = localStorage.getItem("passKey");

            if (!passKey) {
                setBiometricLoader(false)
                return;
            }

            const option = await authAxios.post('/createLoginOption', { userId: passKey });

            const browserRes = await startAuthentication(option.data.option)

            const res = await authAxios.post('/verifyLoginChallenge', { browserRes, userId: passKey })

            setUserAfterLogin(res);

            if (!res.data.user.is2FA) {
                setBiometricLoader(false);
                notify("success", "User logged in successfully")
            }
        } catch (error) {
            setBiometricLoader(false)
            console.log(error);
            notify("error", "Login failed")
        }
    }

    useEffect(() => {
        loginByBiometric()
    }, [])

    useEffect(() => {
        console.log(biometricLoader);
    }, [biometricLoader])

    return <>
        {!showLogin2FA && <div className="login-con">
            <div className="popup">
                <div className="login-header">
                    <i className="ri-close-line" onClick={() => {
                        if (!loader && !googleLoader && !biometricLoader) {
                            setIsLogin(false)
                        }
                    }}></i>
                    <h2>Login</h2>
                </div>
                <form className="body" onSubmit={(e) => {
                    e.preventDefault();
                    if (!loader && !googleLoader && !biometricLoader) {
                        handleLogin()
                    }
                }}>
                    <div className="username common">
                        <div>
                            <input type="text" placeholder="Enter email" name='email' value={login.email} onChange={(e) => { setLogin({ ...login, [e.target.name]: e.target.value }) }} />
                            <i className="ri-mail-line"></i>
                        </div>
                        {message.email && <div>* {message.email}</div>}
                    </div>
                    <div className="password common">
                        <div>
                            <input type="password" placeholder='Enter password' name='password' value={login.password} onChange={(e) => { setLogin({ ...login, [e.target.name]: e.target.value }) }} />
                            <i className="ri-lock-2-line"></i>
                        </div>
                        {message.password && <div>* {message.password}</div>}
                    </div>
                    <div className="forgot" onClick={() => {
                        if (!loader && !googleLoader && !biometricLoader) { setIsLogin(false); setIsForgot(true) }
                    }}>
                        Forgot password?
                    </div>
                    {loader ? <button type="button"><CircularProgress size={22} className='circularprogress' /></button> :
                        <button type="submit">Login</button>}
                </form>
                <div className="register">
                    Don't have an account? <span onClick={() => { if (!loader && !googleLoader && !biometricLoader) { setIsSignUp(true); setIsLogin(false) } }}>Register</span>
                </div>
                <div className="or">
                    <span></span>
                    <span>OR</span>
                    <span></span>
                </div>
                {!googleLoader ?
                    <div className='btng'>
                        <GoogleOAuthProvider className="google-btn" clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
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
                        </GoogleOAuthProvider></div>
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

export default Login