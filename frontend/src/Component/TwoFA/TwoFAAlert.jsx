import { useContext } from 'react';
import '../../CSS/TwoFA/twofaalert.css'
import { AppContext } from '../../App';
const TwoFAAlert = () => {

    const { setShow2FAPopUp, setAlert2FA } = useContext(AppContext);

    return <div className="twofa_alert">
        <div>
            <div>Secure your account with 2FA — quick & easy.</div>
            <div>
                <button type='button' onClick={() => {
                    setShow2FAPopUp(true);
                    localStorage.setItem("timer", Date.now());
                    setAlert2FA(false);
                }}>Enable 2FA</button>
                <button type='button' onClick={() => {
                    localStorage.setItem("timer", Date.now());
                    setAlert2FA(false);
                }}><i className="ri-close-large-line"></i></button>
            </div>
        </div>
    </div>
}

export default TwoFAAlert