import { CircularProgress } from '@mui/material'
import '../../CSS/Reusable/Signup.css'
import axios from "axios"
import { useContext, useState } from 'react'
import { ContextData } from '../../main.jsx'
import { authAxios } from '../../config/axiosconfig.js'

const Signup = ({ setIsSignUp , setIsLogin}) => {
    const [loader, setLoader] = useState(false);

    const { notify } = useContext(ContextData)

    const [signUp, setSignUp] = useState({ name: "", email: "", password: "" })

    const [message, setMessage] = useState({ name: "", email: "", password: "" })

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

    return <div className="signup-con">
        <div className="popup">
            <div className="signup-header">
                <i className="ri-close-line" onClick={() => {
                    if (!loader) { setIsSignUp(false); }
                }}></i>
                <h2>SignUp</h2>
            </div>
            <form className="body" onSubmit={(e) => { e.preventDefault(); if (!loader) { handleRegister() } }}>
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
                Have an account? <span onClick={() => {if (!loader) { setIsSignUp(false); setIsLogin(true)}}}>Login</span>
            </div>

            {/* Social Login */}

            {/* <div className="or">
                <span></span>
                <span>OR</span>
                <span></span>
            </div>
            {true ? (
                <div className="google" onClick={() => {
                    if (!loader) {
                        socialRegister();
                    }
                }}>
                    <i className="ri-google-fill"></i>
                    Continue with Google
                </div>
            ) : (
                <div className="google">
                    <CircularProgress size={21} className='circularprogress' />
                </div>
            )} */}

        </div>
    </div>
}

export default Signup