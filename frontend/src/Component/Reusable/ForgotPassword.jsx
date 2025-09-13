import { useContext, useRef, useState } from "react"
import "../../CSS/Reusable/ForgotPassword.css"
import { CircularProgress } from "@mui/material"
import { ContextData } from "../../main"
import { authAxios } from "../../config/axiosconfig"

const ForgotPassword = ({setIsForgot}) => {
    const { notify } = useContext(ContextData)

    const [loader, setLoader] = useState(false)

    const inputRef = useRef([]);

    const handleInput = (e, idx) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');

        if (e.target.value.length > 0 && idx < inputRef.current.length - 1) {
            inputRef.current[idx + 1].focus();
        }
    }

    const handleDel = (e, idx) => {
        if (e.key === "Backspace" && idx > 0) {
            e.preventDefault();
            inputRef.current[idx].value = "";
            inputRef.current[idx - 1].focus();
        }
    }

    const handlePaste = async () => {
        let numbers = (await navigator.clipboard.readText()).split("");

        let lastIndex = 0;

        for (let idx = 0; idx < numbers.length; idx++) {
            const number = numbers[idx];
            if (isNaN(number)) {
                break;  // loop yahi ruk jayega
            }
            if (idx < inputRef.current.length) {
                inputRef.current[idx].value = number;
                lastIndex = idx;
            }
        }

        lastIndex < 5 ? inputRef.current[lastIndex + 1].focus() : inputRef.current[lastIndex].focus();
    }

    const [isOTP, setIsOTP] = useState(false)
    const [OTPError, setOTPError] = useState("")

    const handleOTP = async () => {
        try {
            setLoader(true)

            const otpValue = inputRef.current.map((ele) => ele.value).join("")

            await authAxios.post('/verifyotp', { otp: otpValue, email });

            inputRef.current.map((ele) => ele.value = "");

            setOTPError("")
            notify("success", "OTP Verify SuccessFully")
            setIsOTP(true);
            setLoader(false)
        } catch (error) {
            setLoader(false)
            if (error?.response?.data?.message) {
                setOTPError(error?.response?.data?.message)
            } else if (error?.message) {
                notify("error" , error?.message)
            }
        }
    }

    const [isEmail, setIsEmail] = useState(false)
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const handleEmail = async () => {
        try {
            setLoader(true);
            if (!email.endsWith("@gmail.com")) throw new Error("Invalid email")

            await authAxios.post('/sendotp', { email })

            setIsEmail(true)
            setEmailError("")
            notify("success", "OTP send successfully")
            setLoader(false);
        } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
                setEmailError(error?.response?.data?.message)
            } else if (error?.message) {
                notify("error" , error?.message)
            }
        }
    }

    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleNewPassword = async () => {
        try {
            setLoader(true);
            
            if(newPassword.length < 8) throw new Error("Password must be 8 character long");

            await authAxios.post('/setnewpassword' , {email , newPassword})

            notify("success" , "Password reset SuccessFully");
            setPasswordError("")
            setLoader(false);
            setIsForgot(false)
        } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
                setPasswordError(error?.response?.data?.message)
            } else if (error?.message) {
                notify("error" , error?.message)
            }
        }
    }

    return <section className='forgot-pass-dialog'>
        {(!isEmail && !isOTP) && <div className="forgot-con">
            <div className="forgot-header">
                <div className="forgot-header-div">
                    <h2>Reset Password ?</h2>
                    <i className="ri-close-fill" onClick={()=>{if(!loader){
                        setIsForgot(false)
                    }}}></i>
                </div>
                <div className="message">
                    Enter your regetered email address
                </div>
            </div>
            <form className="email" onSubmit={(e) => { e.preventDefault(); handleEmail() }}>
                <div className="box">
                    <div className="input">
                        <i className="ri-mail-line"></i>
                        <input type="email" placeholder='example@gmail.com' required value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    {emailError && <div className="error">* {emailError}</div>}
                </div>
                {!loader ? <button type='submit'>Submit</button> :
                    <button type='button'><CircularProgress size={20} color='white' /></button>}
            </form>
        </div>}
        {(isEmail && !isOTP) && <div className="forgot-con">
            <div className="forgot-header">
                <div className="forgot-header-div">
                    <h2>Reset Password OTP</h2>
                    <i className="ri-close-fill" onClick={()=>{if(!loader){
                        setIsForgot(false)
                    }}}></i>
                </div>
                <div className="message">
                    Enter the 6 digit code sent to your email id
                </div>
            </div>
            <form className="otp" onSubmit={(e) => { e.preventDefault(); handleOTP() }}>
                <div className="otp-box" onPaste={(e) => { handlePaste(e) }}>
                    {new Array(6).fill(0).map((_, idx) => {
                        return <input key={idx}
                            type="text"
                            maxLength={1}
                            inputMode="numeric"
                            onInput={(e) => {
                                handleInput(e, idx);
                            }}
                            onKeyDown={(e) => {
                                handleDel(e, idx)
                            }}
                            ref={(e) => {
                                inputRef.current[idx] = e
                            }}
                            placeholder="" />
                    })}
                </div>
                {OTPError && <div className="error">* {OTPError}</div>}

                {!loader ? <button type='submit'>Submit</button> :
                    <button type='button'><CircularProgress size={20} color='white' /></button>}
            </form>
        </div>}
        {(isEmail && isOTP) && <div className="forgot-con">
            <div className="forgot-header">
                <div className="forgot-header-div">
                    <h2>New password</h2>
                    <i className="ri-close-fill" onClick={()=>{if(!loader){
                        setIsForgot(false)
                    }}}></i>
                </div>
                <div className="message">
                    Enter the new password below
                </div>
            </div>
            <form className="email" onSubmit={(e) => { e.preventDefault(); handleNewPassword() }}>
                <div className="box">
                    <div className="input">
                        <i className="ri-lock-2-line"></i>
                        <input type="password" placeholder='New password' required value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
                    </div>
                    {passwordError && <div className="error">* {passwordError}</div>}
                </div>
                {!loader ? <button type='submit'>Submit</button> :
                    <button type='button'><CircularProgress size={18} color='white' /></button>}
            </form>
        </div>}
    </section>
}

export default ForgotPassword