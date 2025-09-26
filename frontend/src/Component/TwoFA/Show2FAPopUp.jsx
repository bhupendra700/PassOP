import { useContext, useEffect, useRef, useState } from 'react'
import '../../CSS/TwoFA/show2FApopup.css'
import twoFAImg from '../../Images/2fa.png'
import { CircularProgress } from '@mui/material';
import { ContextData } from '../../main';
import { AppContext } from '../../App';
import { authAxios } from '../../config/axiosconfig';


const Show2FAPopUp = () => {
    const { setShow2FAPopUp } = useContext(AppContext);

    const { notify, setUser, user } = useContext(ContextData)

    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");

    const [secret, setSecret] = useState(null);

    const generate2FA = async () => {
        try {
            setLoader(true)
            // await new Promise((resolve, reject) => {
            //     setTimeout(() => { resolve(true) }, 1000 * 60 * 5)
            // })
            const res = await authAxios.post('/generateQRCode', { name: user.name });

            if (res.data.success) {
                setSecret(res.data.obj);
            }

            setLoader(false)
        } catch (error) {
            setLoader(false)
            console.log(error);
            notify("error", error?.response?.data?.message || "Something went wrong");
        }
    }

    const otPRef = useRef([]);

    const verifyOTP = async () => {
        try {
            setLoader(true)
            const otp = otPRef.current.map((ele) => ele.value).join("");

            // await new Promise((resolve, reject) => {
            //     setTimeout(() => { resolve(true) }, 1000 * 60 * 5)
            // })

            const res = await authAxios.post('/twoFA_varify', { otp, secret: secret.secret });

            if (res.data.success) {
                notify("success", "Two-factor authentication has been enabled successfully.")
                setUser({ ...user, is2FA: true });
                setShow2FAPopUp(false)
                setLoader(false)
                setError("")
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
        {!secret && <div className="generateqr-con">
            <div className='header-close'>
                <h1>Enable 2 Factor Authentication</h1>
                <i className="ri-close-large-line" onClick={() => { setShow2FAPopUp(false) }}></i>
            </div>
            <p className="message">
                Add an extra layer of security by enabling two-factor authentication.
            </p>
            <div className="qrimage">
                <img src={twoFAImg} alt="2FA Illustration" />
            </div>
            <p className="note">
                For enhanced protection, you’ll be provided with a QR code in the next step.
                Scan it with your authenticator app to complete the setup.
            </p>
            <p className="tip">
                <strong>Security Tip:</strong> Do not share your authentication setup with anyone.
            </p>
            {!loader ? <button onClick={() => { generate2FA() }}>Proceed</button> :
                <button><CircularProgress size={20} className='loader' /></button>}
        </div>}

        {secret && <div className="showqr-con">
            <div className='header-close'><i className="ri-close-large-line" onClick={() => { setShow2FAPopUp(false) }}></i></div>
            <div className='qrimage'>
                <img src={secret.qrCode} alt="QR_Code" />
            </div>
            <p className='app'>Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
            <div className='code'>
                <div>
                    Or enter this code manually:
                </div>
                <div>
                    <div>
                        {secret.secret.match(/.{1,4}/g).join("-")}
                    </div>
                    <i className="ri-file-copy-line" onClick={async () => {
                        await navigator.clipboard.writeText(secret.secret);
                        notify("success", "Code copied to clipboard!")
                    }}></i>
                </div>
            </div>
            <form className='otp' onSubmit={(e) => {e.preventDefault() ; verifyOTP() }}>
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
                {!loader ? <button type='submit'>Verify</button> : <button><CircularProgress className='loader' size={22} /></button>}
            </form>
            <p className="tip">
                🔒 Keep your authenticator app safe. Losing access may lock you out of your account.
            </p>
        </div>}
    </section>
}

export default Show2FAPopUp