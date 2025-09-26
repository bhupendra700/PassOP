import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { ContextData } from "../../main";
import '../../CSS/TwoFA/showdisable2FA.css'
import { AppContext } from "../../App";
import { authAxios } from "../../config/axiosconfig";

const ShowDisable2FA = () => {
    const { notify, backendUrl, setUser, user } = useContext(ContextData)

    const { setShowDisable2FA } = useContext(AppContext);

    const inputRef = useRef([]);
    const [OTPError, setOTPError] = useState("")
    const [loader, setLoader] = useState(false);

    const disable2FAFunc = async () => {
        try {
            setLoader(true);
            // await new Promise((resolve, reject) => {
            //     setTimeout(() => { resolve(true) }, 1000 * 60 * 5)
            // })
            const otp = inputRef.current.map((ele) => ele.value).join("");

            const res = await authAxios.post('/disable2FA', { otp });

            if (res.data.success) {
                notify("success", "Two-Factor Authentication has been disabled successfully.")
                setLoader(false)
                setUser({ ...user, is2FA: false });
                setShowDisable2FA(false);
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
            setOTPError(error?.response?.data?.message || error?.message || "Something went wrong")
        }
    }

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

    useEffect(() => {
        document.documentElement.style.overflow = "hidden"

        return () => document.documentElement.style.overflow = "auto"
    }, [])

    return <section className='disable2FA-pass-dialog'>
        {true && <div className="disable2FA-con">
            <div className="disable2FA-header">
                <div className="disable2FA-header-div">
                    <h4>Disable Two-Factor Authentication</h4>
                    <i className="ri-close-fill" onClick={() => { setShowDisable2FA(false) }}></i>
                </div>
                <div className="message">
                    Enter the 6-digit code from your authenticator app to confirm disable.
                </div>
            </div>
            <form className="otp" onSubmit={(e) => { e.preventDefault(); disable2FAFunc() }}>
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
                {!loader ? <button type='submit'>Disable 2FA</button> :
                    <button type='button'><CircularProgress className="loader" size={22} /></button>}
            </form>
        </div>}
    </section>
}

export default ShowDisable2FA