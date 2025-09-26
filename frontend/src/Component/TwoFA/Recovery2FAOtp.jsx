import { useContext, useEffect, useRef, useState } from "react"
import { CircularProgress } from "@mui/material"
import { ContextData } from "../../main"
import { authAxios } from "../../config/axiosconfig"
import '../../CSS/TwoFA/recovery2faotp.css'

const Recovery2FAOtp = ({ setQRCodeObj, tempUser, setIsLogin }) => {
    useEffect(() => {
        document.documentElement.style.overflow = "hidden"

        return () => document.documentElement.style.overflow = "auto"
    }, [])

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

    const [OTPError, setOTPError] = useState("")

    const handleOTP = async () => {
        try {
            setLoader(true)

            const otpValue = inputRef.current.map((ele) => ele.value).join("")

            const response = await authAxios.post('/verify2FAotp', { otp: otpValue, email: tempUser.email });

            inputRef.current.map((ele) => ele.value = "");

            setOTPError("")
            setQRCodeObj(response.data.obj);
            setLoader(false)
        } catch (error) {
            setLoader(false)
            if (error?.response?.data?.message) {
                setOTPError(error?.response?.data?.message)
            } else {
                notify("error", error?.message || "Something went wrong")
            }
        }
    }

    return <section className='reset-2fa-dialog'>
        <div className="reset-2fa-con">
            <div className="reset-2fa-header">
                <div className="reset-2fa-div">
                    <h2>Reset 2FA OTP</h2>
                    <i className="ri-close-fill" onClick={() => {
                        if (!loader) {
                            setIsLogin(false)
                        }
                    }}></i>
                </div>
                <div className="message">
                    Enter the 6-digit OTP sent to your email to reset 2FA.
                </div>
            </div>
            <form className="otp" onSubmit={(e) => { e.preventDefault(); if (!loader) { handleOTP() } }}>
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
            </form>
        </div>
    </section>
}

export default Recovery2FAOtp