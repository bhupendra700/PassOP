import { useContext, useEffect, useRef, useState } from 'react'
import '../../CSS/TwoFA/show2FApopup.css'
import { CircularProgress } from '@mui/material';
import { ContextData } from '../../main';
import { AppContext } from '../../App';
import { authAxios } from '../../config/axiosconfig';


const ResetQRCode = ({ QRCodeObj, setQRCodeObj, tempUser, setIsLogin }) => {
    const { notify } = useContext(ContextData)

    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");

    const otPRef = useRef([]);

    const verifyOTP = async () => {
        try {
            setLoader(true)
            const otp = otPRef.current.map((ele) => ele.value).join("");

            const res = await authAxios.post('/verifyAuthenticatorOTP', { otp, secret: QRCodeObj.secret, userId: tempUser._id });

            if (res.data.success) {
                setError("")
                setIsLogin(false)
                setLoader(false)
                notify("success", "2FA reset successfully.")
            }
        } catch (error) {
            setLoader(false)
            setError(error?.response?.data?.message || error.message || "Something went wrong")
        }
    }

    const handleInput = (e, idx) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");

        if (e.target.value.length > 0 && idx < otPRef.current.length - 1) {
            otPRef.current[idx + 1].focus();
        }
    }

    const handleDel = (e, idx) => {
        if (e.key === "Backspace" && idx > 0) {
            e.preventDefault();
            otPRef.current[idx].value = "";
            otPRef.current[idx - 1].focus();
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
            if (idx < otPRef.current.length) {
                otPRef.current[idx].value = number;
                lastIndex = idx;
            }
        }

        lastIndex < 5 ? otPRef.current[lastIndex + 1].focus() : otPRef.current[lastIndex].focus();
    }

    useEffect(() => {
        document.documentElement.style.overflow = "hidden";

        return () => document.documentElement.style.overflow = "auto";
    }, []);

    return <section className='show2fapopup'>
        {QRCodeObj && <div className="showqr-con">
            <div className='header-close'><i className="ri-close-large-line" onClick={() => { if (!loader) { setIsLogin(false) } }}></i></div>
            <div className='qrimage'>
                <img src={QRCodeObj.qrCode} alt="QR_Code" />
            </div>
            <p className='app'>Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
            <div className='code'>
                <div>
                    Or enter this code manually:
                </div>
                <div>
                    <div>
                        {QRCodeObj.secret.match(/.{1,4}/g).join("-")}
                        test
                    </div>
                    <i className="ri-file-copy-line" onClick={async () => {
                        await navigator.clipboard.writeText(secret.secret);
                        notify("success", "Code copied to clipboard!")
                    }}></i>
                </div>
            </div>
            <form className='otp'>
                <div className='message'>
                    Enter current 6-digit code from your app to verify
                </div>
                <div className='qr-box'>
                    {Array(6).fill(0).map((ele, idx) => {
                        return <input
                            type="text"
                            ref={(e) => {
                                otPRef.current[idx] = e;
                            }}
                            maxLength={1}
                            placeholder=" "
                            onInput={(e) => { handleInput(e, idx) }}
                            onKeyDown={(e) => { handleDel(e, idx) }}
                            onPaste={(e) => { handlePaste(e, idx) }}
                            key={idx}
                        />
                    })}
                </div>
                {error && <p className="error">* {error}</p>}
                {!loader ? <button onClick={() => { if (!loader) { verifyOTP() } }}>Verify</button> : <button><CircularProgress className='loader' size={22} /></button>}
            </form>
            <p className="tip">
                🔒 Keep your authenticator app safe. Losing access may lock you out of your account.
            </p>

        </div>}
    </section>
}

export default ResetQRCode