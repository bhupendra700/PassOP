import { CircularProgress } from '@mui/material'
import '../../CSS/Reusable/Login.css'
import { useContext, useEffect, useState } from 'react'
import { ContextData } from '../../main'
import { authAxios } from '../../config/axiosconfig'


const Login = ({ setIsLogin, setIsForgot, setIsSignUp }) => {
    const { notify, setUser , setShareableUsers , setRecieveableUsers , setSentDocs , setReceivedDocs} = useContext(ContextData)

    const [login, setLogin] = useState({ email: "", password: "" })

    const [message, setMessage] = useState({ email: "", password: "" })

    const [loader, setLoader] = useState(false)

    const handleLogin = async () => {
        try {
            setLoader(true)
            const res = await authAxios.post('/login', { email: login.email, password: login.password }, { withCredentials: true });

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

            notify("success", "User logged in successfully")
            setLoader(false)
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
            } else {
                notify("error", error?.response?.data?.message)
            }
        }
    }

    useEffect(() => {
        document.body.style.overflow = "hidden"

        return () => document.body.style.overflow = "auto"
    }, [])

    return <div className="login-con">
        <div className="popup">
            <div className="login-header">
                <i className="ri-close-line" onClick={() => {
                    if (!loader) {
                        setIsLogin(false)
                    }
                }}></i>
                <h2>Login</h2>
            </div>
            <form className="body" onSubmit={(e) => {
                e.preventDefault();
                handleLogin()
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
                    if (!loader) { setIsLogin(false); setIsForgot(true) }
                }}>
                    Forgot password?
                </div>
                {loader ? <button type="button"><CircularProgress size={22} className='circularprogress' /></button> :
                    <button type="submit">Login</button>}
            </form>
            <div className="register">
                Don't have an account? <span onClick={() => { if (!loader) { setIsSignUp(true); setIsLogin(false) } }}>Register</span>
            </div>

            {/* Social Login */}

            {/* <div className="or">
                <span></span>
                <span>OR</span>
                <span></span>
            </div>
            <div className="google">
                {true ? <>
                    <i className="ri-google-fill"></i>
                    Continue with google
                </>
                    : <CircularProgress size={21} className='circularprogress' />}
            </div> */}

        </div>
    </div>
}

export default Login