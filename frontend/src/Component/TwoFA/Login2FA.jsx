import { useContext, useRef, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ContextData } from "../../main"
import { authAxios } from "../../config/axiosconfig"
import '../../CSS/TwoFA/login2fa.css'


const Login2FA = ({ tempUser, setTempUser, setIsLogin, setShowRecovery2FA }) => {
    const { notify, setUser, setShareableUsers, setRecieveableUsers, setSentDocs, setReceivedDocs } = useContext(ContextData)

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

    const [OTPError, setOTPError] = useState("")

    const handleLogin2FA = async () => {
        try {
            setLoader(true);

            const otpValue = inputRef.current.map((ele) => ele.value).join("")

            const res = await authAxios.post('/twoFALogin', { otp: otpValue, userId: tempUser._id });

            if (res.data.success) {
                setOTPError("")

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
                setIsLogin(false);
                setLoader(false)
            }
        } catch (error) {
            setLoader(false)
            if (error?.response?.data?.message) {
                setOTPError(error?.response?.data?.message)
            } else {
                notify("error", error?.message || "Something went wrong")
            }
        }
    }

    const [otpLoader, setOtpLoader] = useState(false);

    const sendOtp = async () => {
        try {
            setOtpLoader(true);
            await authAxios.post('/send2FAotp', { userId: tempUser._id, email: tempUser.email });
            notify("success", "Verification code sent to your email.");
            setShowRecovery2FA(true);
            setOtpLoader(false);
        } catch (error) {
            setOtpLoader(false);
            console.log("Error: ", error?.message);
            notify("error", error?.response?.data?.message || error?.message || "Something went wrong")
        }
    }

    return <section className='login2fa-dialog'>
        <div className="login2fa-con">
            <div className="login2fa-header">
                <div className="login2fa-header-div">
                    <h3>Enter 2FA Code</h3>
                    <i className="ri-close-fill" onClick={() => {
                        if (!loader && !otpLoader) {
                            setIsLogin(false)
                        }
                    }}></i>
                </div>
                <div className="message">
                    Enter the 6-digit code from your authenticator app.
                </div>
            </div>
            <form className="otp" onSubmit={(e) => { e.preventDefault(); if(!loader && !otpLoader){handleLogin2FA()} }}>
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
                    <button type='button'><CircularProgress size={20} className="loader" /></button>}
                <div className="reset2fa">
                    <div>Reset Two-Factor Authentication</div>
                    {!otpLoader ? <div onClick={() => { sendOtp() }}><i className="ri-arrow-right-line" ></i></div> :
                        <div><CircularProgress className="loader" size={15} /></div>}
                </div>
            </form>
        </div>
    </section>
}

export default Login2FA